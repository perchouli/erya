'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Home = function (_React$Component) {
  _inherits(Home, _React$Component);

  function Home(props) {
    _classCallCheck(this, Home);

    var _this = _possibleConstructorReturn(this, (Home.__proto__ || Object.getPrototypeOf(Home)).call(this, props));

    _this.state = {
      categories: [],
      posts: []
    };
    return _this;
  }

  _createClass(Home, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      $.getJSON('/api/categories/', function (categories) {
        _this2.setState({ categories: categories });
      });

      $.getJSON('/api/posts/', function (posts) {
        _this2.setState({ posts: posts });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'ui grid container' },
        React.createElement(
          'div',
          { className: 'four wide column' },
          React.createElement(
            'button',
            { className: 'fluid ui button' },
            '发表主题'
          ),
          React.createElement(
            'div',
            { className: 'ui large selection animated list' },
            React.createElement(
              'div',
              { className: 'item' },
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
            this.state.categories.map(function (category) {
              return React.createElement(
                'div',
                { className: 'item' },
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
                React.createElement('img', { className: 'ui avatar image', src: '/images/avatar/small/daniel.jpg' }),
                React.createElement(
                  'div',
                  { className: 'content' },
                  React.createElement(
                    'a',
                    { className: 'header' },
                    post.title
                  ),
                  React.createElement(
                    'div',
                    { className: 'meta' },
                    React.createElement(
                      'p',
                      null,
                      '10 months, 4 weeks前 由 root 发表'
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

[Home].forEach(function (app) {
  var name = app.name.toLowerCase();
  if (document.getElementById(name)) ReactDOM.render(React.createElement(app), document.getElementById(name));
});
