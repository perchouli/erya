class Helper {
  static getCSRFToken () {
    let csrfToken = '';
    if (document.cookie && document.cookie !== '') {
      document.cookie.split(';').forEach(cookie => {
        let [name, value] = cookie.split('=');
        if (name.trim() === 'csrftoken') {
          csrfToken = value;
        }
      });
    }
    return csrfToken;
  }

  static checkLogin () {
    let csrfToken = this.getCSRFToken(),
      isLogin = false;
    $.ajax({
      async: false,
      method: 'POST',
      data: {'login': true},
      url: '/api/posts/',
      headers: {'X-CSRFToken': csrfToken},
      error: response => {
        location.href = '/accounts/login/';
      },
      success: () => {
        isLogin = true;
      }
    });
    return isLogin;
  }

  static displayPostEditor () {
    this.checkLogin();
    let selector = '#editorModal';
    $(selector).toggle();
  }

}

class PostEditor extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      parentId: null
    };
  }

  static get defaultProps () {
    return {categories: [], posts: [], isReply: false};
  }

  componentDidMount () {
    if (this.props.isReply) {
      let thisDOM = ReactDOM.findDOMNode(this);
      $(thisDOM).removeClass('modal').show();
    }
  }

  componentDidUpdate () {
    if (this.props.isReply && this.props.posts.length !== 0 && this.state.parentId === null) {
      this.setState({parentId: this.props.posts[0].id});
    }
  }

  _submit (e) {
    let form = e.target,
      csrfToken = Helper.getCSRFToken(),
      data = $(form).serialize();

    $.ajax({
      method: 'POST',
      url: '/api/posts/',
      data: data,
      headers: {
        'X-CSRFToken': csrfToken
      },
      success: (response) => {
        this.props.insertPost(response);
      }
    });

    e.preventDefault();
  }

  render () {
    return (
      <div className="ui bottom modal" id="editorModal" style={{padding: '10px 20px'}}>
        <form onSubmit={this._submit.bind(this)}>
          <input type="hidden" name="parent_id" defaultValue={this.state.parentId} />
          <div className="ui form">
            <div className="fields">
              <div className="field six wide" style={{display: this.props.isReply ? 'none' : ''}}>
                <select className="ui search dropdown" name="category_id">
                  <option value="0">选择分类</option>
                {this.props.categories.map((category, i) => {
                  return <option key={i} value={category.id}>{category.name}</option>;
                })}
                </select>
              </div>
              <div className="field ten wide">
                <input name="title" type={this.props.isReply ? 'hidden' : 'text'} placeholder="输入标题" defaultValue={(this.props.posts.length !== 0) ? this.props.posts[0].title : ''} />
              </div>
            </div>
            <div className="field sixteen wide"><textarea name="content" placeholder="输入内容..." /></div>
            <button className="ui button primary" type="submit">发布</button>
          </div>
        </form>
      </div>
    );
  }
}

class CategoryChildren extends React.Component {
  componentDidMount () {
    let thisDOM = ReactDOM.findDOMNode(this);
    if (thisDOM !== null) {
      thisDOM.style.marginLeft = '1em';
      thisDOM.parentElement.parentElement.appendChild(thisDOM);
    }
  }

  render () {
    return (
      <div className="item" onClick={this.props.event.bind(this, this.props.id)}>
        <i className={(this.props.icon || 'square') + ' icon'}></i>
        <div className="content">{this.props.name}</div>
      </div>
    );
  }
}

class Home extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      categories: [],
      posts: []
    };
  }

  componentDidMount () {
    $.getJSON('/api/categories/', categories => {
      this.setState({categories: categories});
    });

    $.getJSON('/api/posts/?parent_isnull=True', posts => {
      this.setState({posts: posts});
    });
  }

  _filterByCategory (categoryId, e) {
    let url = '/api/posts/?parent_isnull=True' + (categoryId === null ? '' : '&category=' + categoryId);
    $.getJSON(url, posts => this.setState({posts: posts}));
    e.stopPropagation();
  }

  _displayPostEditor () {
    Helper.displayPostEditor();
  }

  _insertPost (response) {
    let posts = this.state.posts;
    posts.unshift(response);
    this.setState({posts: posts});
  }

  render () {
    return (
      <div className="ui grid container stackable">
        <PostEditor ref="editor" categories={this.state.categories} insertPost={this._insertPost.bind(this)} />
        <div className="four wide column">
          <button className="fluid ui primary button" onClick={this._displayPostEditor.bind(this)}>发布主题</button>
          <div className="ui large selection list animated">
            <div className="item" onClick={this._filterByCategory.bind(this, null)}>
              <i className="comment icon"></i>
              <div className="content">所有主题</div>
            </div>
            <div className="item">
              <i className="block layout icon"></i>
              <div className="content">所有分类</div>
            </div>
            <div className="ui divider"></div>
        {this.state.categories.filter(c => { return c.parent == null; }).map((category, i) => {
          return (
            <div key={i} className="item" onClick={this._filterByCategory.bind(this, category.id)}>
              <i className={(category.icon || 'square') + ' icon'}></i>
              <div className="content">
                <div className="description">{category.name}</div>
              </div>
              {Object.entries(category.children).map(p => { return p[1]; }).map((category, i) => {
                return (<CategoryChildren event={this._filterByCategory.bind(this)} {...category} />);
              })}
            </div>
          );
        })}
          </div>
        </div>

        <div className="twelve wide column">
          <div className="ui very relaxed list">
          {this.state.posts.map((post, i) => {
            return (
              <div key={i} className="item">
                <img className="ui avatar image mini" src={post.author_info.gravatar_url}/>
                <div className="content">
                <h3 className="header"><a href={`posts/${post.id}/`}>{post.title}</a></h3>
                <div className="meta"><p>{post.created_at} 由 <strong>{post.author_info.name}</strong> 发表</p></div>
                <div className="description">{post.content}</div>
                </div>
              </div>
            );
          })
          }
          </div>
        </div>
      </div>
    );
  }
}

class Posts extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      posts: [],
      category: {
        'icon': null,
        'name': null,
        'color': null
      }
    };
  }

  componentDidMount () {
    let dataset = ReactDOM.findDOMNode(this).parentElement.dataset,
      postId = dataset.id,
      posts = this.state.posts;
    $.get('/api/posts/?id=' + postId, response => {
      posts = posts.concat(response);
      this.setState({category: response[0].category || this.state.category});
      $.get('/api/posts/?parent=' + postId, response => {
        posts = posts.concat(response);
        this.setState({posts: posts});
      });
    });
  }

  _insertPost (response) {
    let posts = this.state.posts;
    posts.push(response);
    this.setState({posts: posts});
  }

  _reply (parentId) {
    this.refs.postEditor.setState({parentId: parentId});
  }

  render () {
    return (
      <div className="ui grid">
        <div className={'column sixteen wide center aligned ' + (this.state.category.color)}>
          <button className="ui inverted button"><i className={'icon ' + this.state.category.icon} />{this.state.category.name}</button>
          <h3>{this.state.posts[0] ? this.state.posts[0].title : ''}</h3>
        </div>
        <div className="ui row hidden divider"></div>
        <div className="ui grid stackable container">
          <div className="fourteen wide column">
            <div className="ui comments" style={{maxWidth: '98%'}}>
            {this.state.posts.map((post, i) => {
              return (
              <div>
                <div key={i} className="comment" style={{minHeight: '100px'}}>
                  <a className="avatar" style={{width: '4.5em'}}>
                    <img src={post.author_info.gravatar_url} />
                  </a>
                  <div className="content" style={{marginLeft: '5.5em'}}>
                    <a className="author">{post.author_info.name}</a>
                    <div className="metadata"><div className="date">{post.created_at}</div></div>
                    <div className="text">{post.content}</div>
                    <div className="actions">
                      <a className="reply" onClick={this._reply.bind(this, post.id)}>Reply</a>
                    </div>
                  </div>
                </div>
                <div className="ui divider"></div>
              </div>
              );
            })}
            </div>
            <PostEditor ref="postEditor" posts={this.state.posts} insertPost={this._insertPost.bind(this)} isReply={true}/>

          </div>
          <div className="two wide column"><button className="ui button primary fluid">回复</button></div>
        </div>

      </div>
    );
  }
}

[Home, Posts].forEach(app => {
  let name = app.name.toLowerCase();
  if (document.getElementById(name)) {
    let dom = document.getElementById(name),
      props = dom.dataset;
    ReactDOM.render(React.createElement(app, props), dom);
  }
});
