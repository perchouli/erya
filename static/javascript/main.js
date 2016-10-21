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
    $.getJSON(`/api/posts/?parent_isnull=True&category=${ categoryId }`, posts => this.setState({ posts: posts }));
  }

  render() {
    return React.createElement(
      'div',
      { className: 'ui grid container' },
      React.createElement(
        'div',
        { className: 'four wide column' },
        React.createElement(
          'button',
          { className: 'fluid ui primary button' },
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
              React.createElement('img', { className: 'ui avatar image mini', src: post.author_gravatar }),
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
                      post.author
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

[Home, ReplyList].forEach(app => {
  let name = app.name.toLowerCase();
  if (document.getElementById(name)) {
    let dom = document.getElementById(name),
        props = dom.dataset;
    ReactDOM.render(React.createElement(app, props), dom);
  }
});
