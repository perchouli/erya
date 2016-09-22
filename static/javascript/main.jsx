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

    $.getJSON('/api/posts/', posts => {
      this.setState({posts: posts});
    });
  }
  render() {
    return (
      <div className="ui grid container">
        <div className="four wide column">
          <button className="fluid ui button">发表主题</button>
          <div className="ui large selection animated list">
            <div className="item">
              <i className="comment icon"></i>
              <div className="content">所有主题</div>
            </div>
            <div className="item">
              <i className="block layout icon"></i>
              <div className="content">所有分类</div>
            </div>
            <div className="ui divider"></div>
        {this.state.categories.map(category => {
          return(
            <div className="item">
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
              <img className="ui avatar image mini" src={post.author_gravatar}/>
              <div className="content">
              <h3 className="header">{post.title}</h3>
              <div className="meta"><p>{post.created_at} 由 <strong>{post.author}</strong> 发表</p></div>
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

[Home, ].forEach( app => {
  let name = app.name.toLowerCase();
  if (document.getElementById(name))
    ReactDOM.render(React.createElement(app), document.getElementById(name));
});
