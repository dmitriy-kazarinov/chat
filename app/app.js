window.ee = new EventEmitter();
const messages = [];

let Message = React.createClass({
  render: function() {
    var author = this.props.data.author,
        text = this.props.data.text;

    return (
      <div className='message'>
        <p className='message__author'>{author}:{text}</p>
      </div>
    )
  }
});

let AddMessage = React.createClass({
	getInitialState: function(){
		return {
			author: '',
			text: '',
			emptyAuthor: true,
			emptyText: true
		}
	},
	updateAuthor: function(event){
		let self = this;
		let target = event.target;
		if(target.value.length){
			self.setState({emptyAuthor: false})
		} else {
			self.setState({emptyAuthor: true})
		}
		self.setState({author: target.value});
	},
	updateAuthorText: function(event){
		let self = this;
		let target = event.target;
		if(target.value.length){
			self.setState({emptyText: false})
		} else {
			self.setState({emptyText: true})
		}
		this.setState({text: target.value});
	},
	addData: function(e){
    e.preventDefault();
		let item = [{
		    author: this.state.author,
		    text: this.state.text
		  }];

      socket.emit('messages', item);
  		window.ee.emit('Messages.add', item);
      this.setState({
        author: '',
  			text: '',
  			emptyAuthor: true,
  			emptyText: true
      });
	},
	render: function(){
		return (
			<div>
				<form className='add-message'>
					<input type="text" onChange={this.updateAuthor} value={this.state.author} />
					<textarea onChange={this.updateAuthorText} value={this.state.text}></textarea>
					<button disabled={this.state.emptyAuthor || this.state.emptyText} onClick={this.addData}>Add message</button>
				</form>
			</div>
		)
	}
});

let Messages = React.createClass({
  render: function() {
    let data = this.props.data;
    let messagesTemplate;

    if (data.length > 0) {
      messagesTemplate = data.map((item, index) => {
        return (
          <div key={index} >
          	<Message data={item} />
          </div>
        )
      })
    } else {
      messagesTemplate = <p>Sorry, No messages</p>
    }

    return (
      <div className='messages-template'>
    	{messagesTemplate}
        <strong className={'messages__count ' + (data.length > 0 ? '':'none') }>All messages: {data.length}</strong>
      </div>
    );
  }
});

let App = React.createClass({
  getInitialState: function() {
    socket.on('messages', function(data){
      console.log(data);
      // let updateMessages = newMessages.push(data);
      // this.setState({messages: updateMessages});
    });
    return {
      messages: messages
    };
  },
  componentDidMount: function() {
    /* update this.state.messages*/
    let self = this;
	  window.ee.addListener('Messages.add', (item) => {
	    let newMessages = item.concat(self.state.messages);
      self.setState({messages: newMessages});

	  });
  },
  componentWillUnmount: function() {
    /* messages done */
    window.ee.removeListener('Messages.add');
  },
  render: function() {
    return (
      <div className='app'>
      	<AddMessage />
        <h3>Messages</h3>
        <Messages data={this.state.messages} />
      </div>
    );
  }
});

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
