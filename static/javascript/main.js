'use strict';

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
          var _cookie$split = cookie.split('=');

          var _cookie$split2 = _slicedToArray(_cookie$split, 2);

          var name = _cookie$split2[0];
          var value = _cookie$split2[1];

          if (name === 'csrftoken') csrfToken = value;
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

    _this.state = {};
    return _this;
  }

  _createClass(PostEditor, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      //
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
        headers: { 'X-CSRFToken': csrfToken },
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
          React.createElement(
            'div',
            { className: 'ui form' },
            React.createElement(
              'div',
              { className: 'fields' },
              React.createElement(
                'div',
                { className: 'field six wide' },
                React.createElement(
                  'select',
                  { className: 'ui search dropdown', name: 'category' },
                  React.createElement(
                    'option',
                    null,
                    '选择分类'
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
                React.createElement('input', { name: 'title', placeholder: '输入标题' })
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
  }]);

  return PostEditor;
}(React.Component);

var Home = function (_React$Component2) {
  _inherits(Home, _React$Component2);

  function Home(props) {
    _classCallCheck(this, Home);

    var _this3 = _possibleConstructorReturn(this, (Home.__proto__ || Object.getPrototypeOf(Home)).call(this, props));

    _this3.state = {
      categories: [],
      posts: []
    };
    return _this3;
  }

  _createClass(Home, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this4 = this;

      $.getJSON('/api/categories/', function (categories) {
        _this4.setState({ categories: categories });
      });

      $.getJSON('/api/posts/?parent_isnull=True', function (posts) {
        _this4.setState({ posts: posts });
      });
    }
  }, {
    key: '_filterByCategory',
    value: function _filterByCategory(categoryId) {
      var _this5 = this;

      var url = '/api/posts/?parent_isnull=True' + (categoryId === null ? '' : '&category=' + categoryId);
      $.getJSON(url, function (posts) {
        return _this5.setState({ posts: posts });
      });
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
      posts.push(response);
      this.setState({ posts: posts });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this6 = this;

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
            this.state.categories.map(function (category, i) {
              return React.createElement(
                'div',
                { key: i, className: 'item', onClick: _this6._filterByCategory.bind(_this6, category.id) },
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
            this.state.posts.map(function (post) {
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
  }]);

  return Home;
}(React.Component);

var ReplyList = function (_React$Component3) {
  _inherits(ReplyList, _React$Component3);

  function ReplyList(props) {
    _classCallCheck(this, ReplyList);

    var _this7 = _possibleConstructorReturn(this, (ReplyList.__proto__ || Object.getPrototypeOf(ReplyList)).call(this, props));

    _this7.state = {
      replies: []
    };
    return _this7;
  }

  _createClass(ReplyList, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this8 = this;

      var postId = this.props.postId;
      $.getJSON('/api/posts/?parent=' + postId, function (replies) {
        _this8.setState({ replies: replies });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'ui comments' },
        this.state.replies.map(function (post) {
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
  }]);

  return ReplyList;
}(React.Component);

[Home, ReplyList].forEach(function (app) {
  var name = app.name.toLowerCase();
  if (document.getElementById(name)) {
    var dom = document.getElementById(name),
        props = dom.dataset;
    ReactDOM.render(React.createElement(app, props), dom);
  }
});
