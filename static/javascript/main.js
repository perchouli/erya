class Helper {
  static getCSRFToken() {
    let csrfToken = '';
    if (document.cookie && document.cookie !== '') {
      document.cookie.split(';').forEach(cookie => {
        let [name, value] = cookie.split('=');
        if (name === 'csrftoken') csrfToken = value;
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
      data: { 'login': true },
      url: '/api/posts/',
      headers: { 'X-CSRFToken': csrfToken },
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
    this.state = {};
  }

  static get defaultProps() {
    return { categories: [], posts: [] };
  }

  componentDidUpdate() {
    // Reply
    if (this.props.posts.length !== 0) {
      let thisDOM = ReactDOM.findDOMNode(this);
      $(thisDOM).removeClass('modal').show();
    }
  }

  _submit(e) {
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
      success: response => {
        this.props.insertPost(response);
      }
    });

    e.preventDefault();
  }

  render() {
    return React.createElement(
      'div',
      { className: 'ui bottom modal', id: 'editorModal', style: { padding: '10px 20px' } },
      React.createElement(
        'form',
        { onSubmit: this._submit.bind(this) },
        React.createElement('input', { type: 'hidden', name: 'parent_id', defaultValue: this.props.posts.length !== 0 ? this.props.posts[0].id : '' }),
        React.createElement(
          'div',
          { className: 'ui form' },
          React.createElement(
            'div',
            { className: 'fields' },
            React.createElement(
              'div',
              { className: 'field six wide', style: { display: this.props.posts.length !== 0 ? 'none' : '' } },
              React.createElement(
                'select',
                { className: 'ui search dropdown', name: 'category_id', defaultValue: this.props.posts.length !== 0 ? this.props.posts[0].category.id : '' },
                React.createElement(
                  'option',
                  { value: '0' },
                  '选择分类'
                ),
                this.props.categories.map((category, i) => {
                  return React.createElement(
                    'option',
                    { key: i, value: category.id },
                    category.name
                  );
                })
              )
            ),
            React.createElement(
              'div',
              { className: 'field ten wide' },
              React.createElement('input', { name: 'title', type: this.props.posts.length !== 0 ? 'hidden' : 'text', placeholder: '输入标题', defaultValue: this.props.posts.length !== 0 ? this.props.posts[0].title : '' })
            )
          ),
          React.createElement(
            'div',
            { className: 'field sixteen wide' },
            React.createElement('textarea', { name: 'content', placeholder: '输入内容...' })
          ),
          React.createElement(
            'button',
            { className: 'ui button primary', type: 'submit' },
            '发布'
          )
        )
      )
    );
  }
}

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      posts: []
    };
  }

  componentDidMount() {
    $.getJSON('/api/categories/', categories => {
      this.setState({ categories: categories });
    });

    $.getJSON('/api/posts/?parent_isnull=True', posts => {
      this.setState({ posts: posts });
    });
  }

  _filterByCategory(categoryId) {
    let url = '/api/posts/?parent_isnull=True' + (categoryId === null ? '' : '&category=' + categoryId);
    $.getJSON(url, posts => this.setState({ posts: posts }));
  }

  _displayPostEditor() {
    Helper.displayPostEditor();
  }

  _insertPost(response) {
    let posts = this.state.posts;
    posts.unshift(response);
    this.setState({ posts: posts });
  }

  render() {
    return React.createElement(
      'div',
      { className: 'ui grid container' },
      React.createElement(PostEditor, { ref: 'editor', categories: this.state.categories, insertPost: this._insertPost.bind(this) }),
      React.createElement(
        'div',
        { className: 'four wide column' },
        React.createElement(
          'button',
          { className: 'fluid ui primary button', onClick: this._displayPostEditor.bind(this) },
          '发布主题'
        ),
        React.createElement(
          'div',
          { className: 'ui large selection animated list' },
          React.createElement(
            'div',
            { className: 'item', onClick: this._filterByCategory.bind(this, null) },
            React.createElement('i', { className: 'comment icon' }),
            React.createElement(
              'div',
              { className: 'content' },
              '所有主题'
            )
          ),
          React.createElement(
            'div',
            { className: 'item' },
            React.createElement('i', { className: 'block layout icon' }),
            React.createElement(
              'div',
              { className: 'content' },
              '所有分类'
            )
          ),
          React.createElement('div', { className: 'ui divider' }),
          this.state.categories.map((category, i) => {
            return React.createElement(
              'div',
              { key: i, className: 'item', onClick: this._filterByCategory.bind(this, category.id) },
              React.createElement('i', { className: (category.icon || 'square') + ' icon' }),
              React.createElement(
                'div',
                { className: 'content' },
                category.name
              )
            );
          })
        )
      ),
      React.createElement(
        'div',
        { className: 'twelve wide column' },
        React.createElement(
          'div',
          { className: 'ui very relaxed list' },
          this.state.posts.map(post => {
            return React.createElement(
              'div',
              { className: 'item' },
              React.createElement('img', { className: 'ui avatar image mini', src: post.author_info.gravatar_url }),
              React.createElement(
                'div',
                { className: 'content' },
                React.createElement(
                  'h3',
                  { className: 'header' },
                  React.createElement(
                    'a',
                    { href: `posts/${ post.id }/` },
                    post.title
                  )
                ),
                React.createElement(
                  'div',
                  { className: 'meta' },
                  React.createElement(
                    'p',
                    null,
                    post.created_at,
                    ' 由 ',
                    React.createElement(
                      'strong',
                      null,
                      post.author_info.name
                    ),
                    ' 发表'
                  )
                ),
                React.createElement(
                  'div',
                  { className: 'description' },
                  post.content
                )
              )
            );
          })
        )
      )
    );
  }
}

class Posts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      category: {}
    };
  }

  componentDidMount() {
    let dataset = ReactDOM.findDOMNode(this).parentElement.dataset,
        postId = dataset.id,
        posts = this.state.posts;
    $.get('/api/posts/?id=' + postId, response => {
      posts = posts.concat(response);
      this.setState({ category: response[0].category });
      $.get('/api/posts/?parent=' + postId, response => {
        posts = posts.concat(response);
        this.setState({ posts: posts });
      });
    });
  }

  _insertPost(response) {
    let posts = this.state.posts;
    posts.push(response);
    this.setState({ posts: posts });
  }

  render() {
    return React.createElement(
      'div',
      { className: 'ui grid' },
      React.createElement(
        'div',
        { className: "column sixteen wide center aligned " + this.state.category.color },
        React.createElement(
          'button',
          { className: 'ui inverted button' },
          React.createElement('i', { className: 'icon ' + this.state.category.icon }),
          this.state.category.name
        ),
        React.createElement(
          'h3',
          null,
          this.state.posts[0] ? this.state.posts[0].title : ''
        )
      ),
      React.createElement('div', { className: 'ui row hidden divider' }),
      React.createElement(
        'div',
        { className: 'ui grid stackable container' },
        React.createElement(
          'div',
          { className: 'fourteen wide column' },
          React.createElement(
            'div',
            { className: 'ui comments', style: { maxWidth: '98%' } },
            this.state.posts.map((post, i) => {
              return React.createElement(
                'div',
                null,
                React.createElement(
                  'div',
                  { key: i, className: 'comment', style: { minHeight: '100px' } },
                  React.createElement(
                    'a',
                    { className: 'avatar', style: { width: '4.5em' } },
                    React.createElement('img', { src: post.author_info.gravatar_url })
                  ),
                  React.createElement(
                    'div',
                    { className: 'content', style: { marginLeft: '5.5em' } },
                    React.createElement(
                      'a',
                      { className: 'author' },
                      post.author_info.name
                    ),
                    React.createElement(
                      'div',
                      { className: 'metadata' },
                      React.createElement(
                        'div',
                        { className: 'date' },
                        post.created_at
                      )
                    ),
                    React.createElement(
                      'div',
                      { className: 'text' },
                      post.content
                    ),
                    React.createElement(
                      'div',
                      { className: 'actions' },
                      React.createElement(
                        'a',
                        { className: 'reply' },
                        'Reply'
                      )
                    )
                  )
                ),
                React.createElement('div', { className: 'ui divider' })
              );
            })
          ),
          React.createElement(PostEditor, { posts: this.state.posts, insertPost: this._insertPost.bind(this) })
        ),
        React.createElement(
          'div',
          { className: 'two wide column' },
          React.createElement(
            'button',
            { className: 'ui button primary fluid' },
            '回复'
          )
        )
      )
    );
  }
}

class ReplyList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      replies: []
    };
  }

  componentDidMount() {
    let postId = this.props.postId;
    $.getJSON(`/api/posts/?parent=${ postId }`, replies => {
      this.setState({ replies: replies });
    });
  }
  render() {
    return React.createElement(
      'div',
      { className: 'ui comments' },
      this.state.replies.map(post => {
        return React.createElement(
          'div',
          { className: 'comment' },
          React.createElement(
            'a',
            { className: 'avatar' },
            React.createElement('img', { className: 'ui avatar image mini', src: post.author_gravatar })
          ),
          React.createElement(
            'div',
            { className: 'content' },
            React.createElement(
              'a',
              { className: 'author', href: '#' },
              post.author
            ),
            React.createElement(
              'div',
              { className: 'metadata' },
              React.createElement(
                'div',
                { className: 'date' },
                post.created_at,
                ' '
              )
            ),
            React.createElement(
              'div',
              { className: 'text' },
              post.content
            )
          )
        );
      })
    );
  }
}

[Home, Posts, ReplyList].forEach(app => {
  let name = app.name.toLowerCase();
  if (document.getElementById(name)) {
    let dom = document.getElementById(name),
        props = dom.dataset;
    ReactDOM.render(React.createElement(app, props), dom);
  }
});
