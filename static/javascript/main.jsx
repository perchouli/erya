class Helper {
  static getCSRFToken() {
    let csrfToken = '';
    if (document.cookie && document.cookie !== '') {
      document.cookie.split(';').forEach(cookie => {
        let [name, value] = cookie.split('=');
        if (name === 'csrftoken')
          csrfToken = value;
      });
    }
    return csrfToken;
  }

  static checkLogin() {
    let csrfToken = this.getCSRFToken(),
      isLogin = false;
    $.ajax({
      async: false,
      method: 'POST',
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

  static displayPostEditor() {
    this.checkLogin();
    let selector = '#editorModal';
    $(selector).toggle();
  }

}

class PostEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    //
  }

  _submit(e) {
    let form = e.target,
      csrfToken = Helper.getCSRFToken(),
      data = $(form).serialize();
    $.ajax({
      method: 'POST',
      url: '/api/posts/',
      data: data,
      headers: {'X-CSRFToken': csrfToken},
      success: (response) => {
        this.props.insertPost(response)
      }
    });

    e.preventDefault();
  }

  render() {
    return (
      <div className="ui bottom modal" id="editorModal" style={{padding: '10px 20px'}}>
        <form onSubmit={this._submit.bind(this)}>
          <div className="ui form">
            <div className="fields">
              <div className="field six wide">
                <select className="ui search dropdown" name="category">
                  <option>选择分类</option>
                {this.props.categories.map((category, i) => {
                  return <option key={i} value={category.id}>{category.name}</option>;
                })}
                </select>
              </div>
              <div className="field ten wide">
                <input name="title" placeholder="输入标题" />
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

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      posts: [],
    };
  }

  componentDidMount() {
    $.getJSON('/api/categories/', categories => {
      this.setState({categories: categories});
    });

    $.getJSON('/api/posts/?parent_isnull=True', posts => {
      this.setState({posts: posts});
    });
  }

  _filterByCategory(categoryId) {
    let url = '/api/posts/?parent_isnull=True' + (categoryId === null ? '' : '&category=' + categoryId);
    $.getJSON(url, posts => this.setState({posts: posts}));
  }

  _displayPostEditor() {
    Helper.displayPostEditor();
  }

  _insertPost(response) {
    let posts = this.state.posts;
    posts.push(response);
    this.setState({posts: posts});
  }

  render() {
    return (
      <div className="ui grid container">
        <PostEditor ref="editor" categories={this.state.categories} insertPost={this._insertPost.bind(this)} />
        <div className="four wide column">
          <button className="fluid ui primary button" onClick={this._displayPostEditor.bind(this)}>发布主题</button>
          <div className="ui large selection animated list">
            <div className="item" onClick={this._filterByCategory.bind(this, null)}>
              <i className="comment icon"></i>
              <div className="content">所有主题</div>
            </div>
            <div className="item">
              <i className="block layout icon"></i>
              <div className="content">所有分类</div>
            </div>
            <div className="ui divider"></div>
        {this.state.categories.map((category, i) => {
          return(
            <div key={i} className="item" onClick={this._filterByCategory.bind(this, category.id)}>
              <i className={(category.icon || 'square') + ' icon'}></i>
              <div className="content">{category.name}</div>
            </div>
          )
        })}
          </div>
        </div>

        <div className="twelve wide column">
          <div className="ui very relaxed list">
        {this.state.posts.map(post => {
          return(
            <div className="item">
              <img className="ui avatar image mini" src={post.author_info.gravatar_url}/>
              <div className="content">
              <h3 className="header"><a href={`posts/${post.id}/`}>{post.title}</a></h3>
              <div className="meta"><p>{post.created_at} 由 <strong>{post.author_info.name}</strong> 发表</p></div>
              <div className="description">{post.content}</div>
              </div>
            </div>
            )
          })
        }
          </div>
        </div>
      </div>
    );
  }
}

class ReplyList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      replies: [],
    };
  }

  componentDidMount() {
    let postId = this.props.postId;
    $.getJSON(`/api/posts/?parent=${postId}`, replies => {
      this.setState({replies: replies});
    });
  }
  render() {
    return (
      <div className="ui comments">
        {this.state.replies.map(post => {
          return(
            <div className="comment">
              <a className="avatar"><img className="ui avatar image mini" src={post.author_gravatar}/></a>
              <div className="content">
                <a className="author" href="#">{post.author}</a>
                <div className="metadata"><div className="date">{post.created_at} </div></div>
                <div className="text">{post.content}</div>
              </div>
            </div>
            )
          })
        }
      </div>
    );
  }
}

[Home, ReplyList].forEach( app => {
  let name = app.name.toLowerCase();
  if (document.getElementById(name)) {
    let dom = document.getElementById(name),
      props = dom.dataset;
    ReactDOM.render(React.createElement(app, props), dom);
  }
});
