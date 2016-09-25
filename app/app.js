window.ee = new EventEmitter();
var my_news = [
  {
    author: 'author1',
    text: 'text1',
	bigText: 'bigText1'
  },
  {
    author: 'author2',
    text: 'text2',
	bigText: 'bigText2'
  },
  {
    author: 'author3',
    text: 'text3',
	bigText: 'bigText3'
  }
];

var Article = React.createClass({
  getInitialState: function() {
    return {
      visible: false,
      rating: 0
    };
  },
  readmoreClick: function(e) {
    e.preventDefault();
    this.setState({visible: true});
  },
  addRating: function(){
  	this.setState({rating: ++this.state.rating}, function(){
  		console.log(this);
  	});
  },
  render: function() {
    var author = this.props.data.author,
        text = this.props.data.text,
		bigText = this.props.data.bigText,
		visible = this.state.visible,
		rating = this.state.rating;

    return (
      <div className='article'>
        <p className='news__author'>{author}:</p>
        <p className='news__text'>{text}</p>
		<a href="#"
			onClick={this.readmoreClick}
			className={'news__readmore ' + (visible ? 'none': '')}>
			More
		</a>
		<p className={'news__big-text ' + (visible ? '': 'none')}>{bigText}</p>
		<button onClick={this.addRating}>{rating}</button>
      </div>
    )
  }
});

var Add = React.createClass({
	getInitialState: function(){
		return {
			author: '',
			text: '',
			accept: true,
			emptyAuthor: true,
			emptyText: true
		}
	},
	updateAuthor: function(event){
		var self = this;
		var target = event.target;
		if(target.value.length){
			self.setState({emptyAuthor: false})
		} else {
			self.setState({emptyAuthor: true})
		}
		self.setState({author: event.target.value});
	},
	updateAuthorText: function(event){
		var self = this;
		var target = event.target;
		if(target.value.length){
			self.setState({emptyText: false})
		} else {
			self.setState({emptyText: true})
		}
		this.setState({text: event.target.value});
	},
	showInfoAuthor: function(){
		var item = [{
		    author: this.state.author,
		    text: this.state.text,
		    bigText: '...'
		  }];

  		window.ee.emit('News.add', item);
  		this.state.text = '';
	},
	addAccept: function(){
		if(!this.state.accept){
			this.setState({accept: true})
		} else {
			this.setState({accept: false})
		}

	},
	render: function(){
		return (
			<div>
				<form className='add cf'>
					<input type="text" onChange={this.updateAuthor} value={this.state.author} />
					<textarea onChange={this.updateAuthorText} value={this.state.text}></textarea>
					<input type="checkbox" onChange={this.addAccept} value={this.state.accept} />
					<button disabled={this.state.accept || this.state.emptyAuthor || this.state.emptyText} onClick={this.showInfoAuthor}>Add data</button>
				</form>
			</div>
		)
	}
});


// var TestInput = React.createClass({
// 	getInitialState: function(){
// 		return {
// 			inputText: "Test text"
// 		}
// 	},
// 	componentDidMount: function() { //add focus to input
//      	ReactDOM.findDOMNode(this.refs.inputTextUncontrol).focus();
//     },
// 	changeInput: function(e){
// 		this.setState({inputText: e.target.value});
// 	},
// 	showInfo: function(){
// 		alert(this.state.inputText);
// 	},
// 	showInfoUncontrol: function(){
// 		console.log(this.refs);
// 		alert(ReactDOM.findDOMNode(this.refs.inputTextUncontrol).value);
// 	},
// 	render: function(){
// 		return (
// 			<div>
// 				<div className="input-row">
// 					<input
// 					type="text"
// 					className='test-input'
// 					value={this.state.inputText}
// 					onChange={this.changeInput} />
// 					<button onClick={this.showInfo}>Show info</button>
// 				</div>
// 				<div className="input-row">
// 					<input
// 					type="text"
// 					className='test-input'
// 					defaultValue="Default text"
// 					ref="inputTextUncontrol" />
// 					<button
// 						onClick={this.showInfoUncontrol}
// 						ref="buttonTest">Show info</button>
// 				</div>
// 			</div>
// 		);
// 	}
// });

var News = React.createClass({
  render: function() {
    var data = this.props.data;
    var newsTemplate;

    if (data.length > 0) {
      newsTemplate = data.map(function(item, index) {
        return (
          <div key={index} >
          	<Article data={item} />
          </div>
        )
      })
    } else {
      newsTemplate = <p>No news</p>
    }

    return (
      <div className='news'>
        // <TestInput />
    	{newsTemplate}
        <strong className={'news__count ' + (data.length > 0 ? '':'none') }>All news: {data.length}</strong>
      </div>
    );
  }
});

var App = React.createClass({
  getInitialState: function() {
    return {
      news: my_news
    };
  },
  componentDidMount: function() {
    /* update this.state.news*/
    var self = this;
	  window.ee.addListener('News.add', function(item) {
	    var nextNews = item.concat(self.state.news);
	    self.setState({news: nextNews});
	  });
  },
  componentWillUnmount: function() {
    /* news done */
    window.ee.removeListener('News.add');
  },
  render: function() {
    return (
      <div className='app'>
      	<Add />
        <h3>News</h3>
        <News data={this.state.news} />
      </div>
    );
  }
});

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
