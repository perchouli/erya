'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Helper = function () {
  function Helper() {
    _classCallCheck(this, Helper);
  }

  _createClass(Helper, null, [{
    key: 'getCSRFToken',
    value: function getCSRFToken() {
      var csrfToken = '';
      if (document.cookie && document.cookie !== '') {
        document.cookie.split(';').forEach(function (cookie) {
          var _cookie$split = cookie.split('='),
              _cookie$split2 = _slicedToArray(_cookie$split, 2),
              name = _cookie$split2[0],
              value = _cookie$split2[1];

          if (name.trim() === 'csrftoken') {
            csrfToken = value;
          }
        });
      }
      return csrfToken;
    }
  }, {
    key: 'checkLogin',
    value: function checkLogin() {
      var csrfToken = this.getCSRFToken(),
          isLogin = false;
      $.ajax({
        async: false,
        method: 'POST',
        data: { 'login': true },
        url: '/api/posts/',
        headers: { 'X-CSRFToken': csrfToken },
        error: function error(response) {
          location.href = '/accounts/login/';
        },
        success: function success() {
          isLogin = true;
        }
      });
      return isLogin;
    }
  }, {
    key: 'displayPostEditor',
    value: function displayPostEditor() {
      this.checkLogin();
      var selector = '#editorModal';
      $(selector).toggle();
    }
  }]);

  return Helper;
}();

var PostEditor = function (_React$Component) {
  _inherits(PostEditor, _React$Component);

  function PostEditor(props) {
    _classCallCheck(this, PostEditor);

    var _this = _possibleConstructorReturn(this, (PostEditor.__proto__ || Object.getPrototypeOf(PostEditor)).call(this, props));

    _this.state = {
      parentId: null
    };
    return _this;
  }

  _createClass(PostEditor, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (this.props.isReply) {
        var thisDOM = ReactDOM.findDOMNode(this);
        $(thisDOM).removeClass('modal').show();
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      if (this.props.isReply && this.props.posts.length !== 0 && this.state.parentId === null) {
        this.setState({ parentId: this.props.posts[0].id });
      }
    }
  }, {
    key: '_submit',
    value: function _submit(e) {
      var _this2 = this;

      var form = e.target,
          csrfToken = Helper.getCSRFToken(),
          data = $(form).serialize();

      $.ajax({
        method: 'POST',
        url: '/api/posts/',
        data: data,
        headers: {
          'X-CSRFToken': csrfToken
        },
        success: function success(response) {
          _this2.props.insertPost(response);
        }
      });

      e.preventDefault();
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'ui bottom modal', id: 'editorModal', style: { padding: '10px 20px' } },
        React.createElement(
          'form',
          { onSubmit: this._submit.bind(this) },
          React.createElement('input', { type: 'hidden', name: 'parent_id', defaultValue: this.state.parentId }),
          React.createElement(
            'div',
            { className: 'ui form' },
            React.createElement(
              'div',
              { className: 'fields' },
              React.createElement(
                'div',
                { className: 'field six wide', style: { display: this.props.isReply ? 'none' : '' } },
                React.createElement(
                  'select',
                  { className: 'ui search dropdown', name: 'category_id' },
                  React.createElement(
                    'option',
                    { value: '0' },
                    '\u9009\u62E9\u5206\u7C7B'
                  ),
                  this.props.categories.map(function (category, i) {
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
                React.createElement('input', { name: 'title', type: this.props.isReply ? 'hidden' : 'text', placeholder: '\u8F93\u5165\u6807\u9898', defaultValue: this.props.posts.length !== 0 ? this.props.posts[0].title : '' })
              )
            ),
            React.createElement(
              'div',
              { className: 'field sixteen wide' },
              React.createElement('textarea', { name: 'content', placeholder: '\u8F93\u5165\u5185\u5BB9...' })
            ),
            React.createElement(
              'button',
              { className: 'ui button primary', type: 'submit' },
              '\u53D1\u5E03'
            )
          )
        )
      );
    }
  }], [{
    key: 'defaultProps',
    get: function get() {
      return { categories: [], posts: [], isReply: false };
    }
  }]);

  return PostEditor;
}(React.Component);

var CategoryChildren = function (_React$Component2) {
  _inherits(CategoryChildren, _React$Component2);

  function CategoryChildren() {
    _classCallCheck(this, CategoryChildren);

    return _possibleConstructorReturn(this, (CategoryChildren.__proto__ || Object.getPrototypeOf(CategoryChildren)).apply(this, arguments));
  }

  _createClass(CategoryChildren, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var thisDOM = ReactDOM.findDOMNode(this);
      if (thisDOM !== null) {
        thisDOM.style.marginLeft = '1em';
        thisDOM.parentElement.parentElement.appendChild(thisDOM);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'item', onClick: this.props.event.bind(this, this.props.id) },
        React.createElement('i', { className: (this.props.icon || 'square') + ' icon' }),
        React.createElement(
          'div',
          { className: 'content' },
          this.props.name
        )
      );
    }
  }]);

  return CategoryChildren;
}(React.Component);

var Home = function (_React$Component3) {
  _inherits(Home, _React$Component3);

  function Home(props) {
    _classCallCheck(this, Home);

    var _this4 = _possibleConstructorReturn(this, (Home.__proto__ || Object.getPrototypeOf(Home)).call(this, props));

    _this4.state = {
      categories: [],
      posts: []
    };
    return _this4;
  }

  _createClass(Home, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this5 = this;

      $.getJSON('/api/categories/', function (categories) {
        _this5.setState({ categories: categories });
      });

      $.getJSON('/api/posts/?parent_isnull=True', function (posts) {
        _this5.setState({ posts: posts });
      });
    }
  }, {
    key: '_filterByCategory',
    value: function _filterByCategory(categoryId, e) {
      var _this6 = this;

      var url = '/api/posts/?parent_isnull=True' + (categoryId === null ? '' : '&category=' + categoryId);
      $.getJSON(url, function (posts) {
        return _this6.setState({ posts: posts });
      });
      e.stopPropagation();
    }
  }, {
    key: '_displayPostEditor',
    value: function _displayPostEditor() {
      Helper.displayPostEditor();
    }
  }, {
    key: '_insertPost',
    value: function _insertPost(response) {
      var posts = this.state.posts;
      posts.unshift(response);
      this.setState({ posts: posts });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this7 = this;

      return React.createElement(
        'div',
        { className: 'ui grid container stackable' },
        React.createElement(PostEditor, { ref: 'editor', categories: this.state.categories, insertPost: this._insertPost.bind(this) }),
        React.createElement(
          'div',
          { className: 'four wide column' },
          React.createElement(
            'button',
            { className: 'fluid ui primary button', onClick: this._displayPostEditor.bind(this) },
            '\u53D1\u5E03\u4E3B\u9898'
          ),
          React.createElement(
            'div',
            { className: 'ui large selection list animated' },
            React.createElement(
              'div',
              { className: 'item', onClick: this._filterByCategory.bind(this, null) },
              React.createElement('i', { className: 'comment icon' }),
              React.createElement(
                'div',
                { className: 'content' },
                '\u6240\u6709\u4E3B\u9898'
              )
            ),
            React.createElement(
              'div',
              { className: 'item' },
              React.createElement('i', { className: 'block layout icon' }),
              React.createElement(
                'div',
                { className: 'content' },
                '\u6240\u6709\u5206\u7C7B'
              )
            ),
            React.createElement('div', { className: 'ui divider' }),
            this.state.categories.filter(function (c) {
              return c.parent == null;
            }).map(function (category, i) {
              return React.createElement(
                'div',
                { key: i, className: 'item', onClick: _this7._filterByCategory.bind(_this7, category.id) },
                React.createElement('i', { className: (category.icon || 'square') + ' icon' }),
                React.createElement(
                  'div',
                  { className: 'content' },
                  React.createElement(
                    'div',
                    { className: 'description' },
                    category.name
                  )
                ),
                Object.entries(category.children).map(function (p) {
                  return p[1];
                }).map(function (category, i) {
                  return React.createElement(CategoryChildren, _extends({ event: _this7._filterByCategory.bind(_this7) }, category));
                })
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
            this.state.posts.map(function (post, i) {
              return React.createElement(
                'div',
                { key: i, className: 'item' },
                React.createElement('img', { className: 'ui avatar image mini', src: post.author_info.gravatar_url }),
                React.createElement(
                  'div',
                  { className: 'content' },
                  React.createElement(
                    'h3',
                    { className: 'header' },
                    React.createElement(
                      'a',
                      { href: 'posts/' + post.id + '/' },
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
                      ' \u7531 ',
                      React.createElement(
                        'strong',
                        null,
                        post.author_info.name
                      ),
                      ' \u53D1\u8868'
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
  }]);

  return Home;
}(React.Component);

var Posts = function (_React$Component4) {
  _inherits(Posts, _React$Component4);

  function Posts(props) {
    _classCallCheck(this, Posts);

    var _this8 = _possibleConstructorReturn(this, (Posts.__proto__ || Object.getPrototypeOf(Posts)).call(this, props));

    _this8.state = {
      posts: [],
      category: {
        'icon': null,
        'name': null,
        'color': null
      }
    };
    return _this8;
  }

  _createClass(Posts, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this9 = this;

      var dataset = ReactDOM.findDOMNode(this).parentElement.dataset,
          postId = dataset.id,
          posts = this.state.posts;
      $.get('/api/posts/?id=' + postId, function (response) {
        posts = posts.concat(response);
        _this9.setState({ category: response[0].category || _this9.state.category });
        $.get('/api/posts/?parent=' + postId, function (response) {
          posts = posts.concat(response);
          _this9.setState({ posts: posts });
        });
      });
    }
  }, {
    key: '_insertPost',
    value: function _insertPost(response) {
      var posts = this.state.posts;
      posts.push(response);
      this.setState({ posts: posts });
    }
  }, {
    key: '_reply',
    value: function _reply(parentId) {
      this.refs.postEditor.setState({ parentId: parentId });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this10 = this;

      return React.createElement(
        'div',
        { className: 'ui grid' },
        React.createElement(
          'div',
          { className: 'column sixteen wide center aligned ' + this.state.category.color },
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
              this.state.posts.map(function (post, i) {
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
                          { className: 'reply', onClick: _this10._reply.bind(_this10, post.id) },
                          'Reply'
                        )
                      )
                    )
                  ),
                  React.createElement('div', { className: 'ui divider' })
                );
              })
            ),
            React.createElement(PostEditor, { ref: 'postEditor', posts: this.state.posts, insertPost: this._insertPost.bind(this), isReply: true })
          ),
          React.createElement(
            'div',
            { className: 'two wide column' },
            React.createElement(
              'button',
              { className: 'ui button primary fluid' },
              '\u56DE\u590D'
            )
          )
        )
      );
    }
  }]);

  return Posts;
}(React.Component);

[Home, Posts].forEach(function (app) {
  var name = app.name.toLowerCase();
  if (document.getElementById(name)) {
    var dom = document.getElementById(name),
        props = dom.dataset;
    ReactDOM.render(React.createElement(app, props), dom);
  }
});
