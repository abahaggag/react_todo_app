var ToDoApp = React.createClass({
	getInitialState: function(){
		return (
			{
				allData: [],
				data: [],
				view: "all"
			}
		);
	},

	componentWillMount: function(){
		this.setDataToView(this.state.view);
	},

	setDataToView: function(itemsToView){
		this.setState({view: itemsToView});

		switch (itemsToView){
			case "all":
				this.setState({data: this.state.allData});
				break;
			
			case "completed":
				var completed = this.state.allData.filter(function(item){
					return item.completed;
				});

				this.setState({data: completed});
			break;

			case "not-completed":
				var notCompleted = this.state.allData.filter(function(item){
					return !item.completed;
				});

				this.setState({data: notCompleted});
			break;
		}
	},

	getStatistics: function(){
		var statistics = {
			all: this.state.allData.length, 
			completed: this.state.allData.filter(function(item){return item.completed}).length, 
			notCompleted: this.state.allData.filter(function(item){return !item.completed}).length
		};
		
		return statistics;
	},

	nextId: function(){
		this.uniqueId = this.uniqueId || 3;
		return this.uniqueId++;
	},

	addToDoItem: function(newText){
		var newToDoItem = {id: this.nextId(), text: newText, completed: false};
		var arrData = this.state.allData;
		arrData.push(newToDoItem);

		this.setState({allData: arrData});
		this.setDataToView(this.state.view);
	},

	editToDoItem: function(text, index){
		var arrData = this.state.allData;
		arrData[index].text = text;

		this.setState({allData: arrData});
	},

	deleteToDoItem: function(index){
		var arrData = this.state.allData;
		arrData.splice(index, 1);
		
		this.setState({allData: arrData});
	},

	changeCompleteStatus: function(completed, index){
		var arrData = this.state.allData;
		arrData[index].completed = completed;
		
		this.setState({allData: arrData});
	},

	changeCompleteAllStatus: function(completed){
		var arrData = this.state.allData;
		arrData.forEach(function(item){
			item.completed = completed;
		});

		this.setState({allData: arrData});
		this.setDataToView(this.state.view);
	},

	viewButtonSelection: function(whatToView){
		// whatToView: all, completed or not-completed
		this.setDataToView(whatToView);
	},

	clearButtonSelection: function(whatToClear){
		
		var itemsToClear = [];		
		
		if (whatToClear == "all") {
			this.setState({allData: []});
		}
		else {
			itemsToClear = this.state.allData.filter(function(item) {
				return whatToClear == "completed" ? item.completed : !item.completed;
			});

			var arrData = this.state.allData;

			itemsToClear.forEach(function(item){
				arrData.splice(this.getIndexById(item.id), 1);
			}, this);

			this.setState({allData: arrData});
		}
	},

	getIndexById: function(id){
		var index;
		
		for (var i=0; i<this.state.allData.length; i++)
		{
			if(this.state.allData[i].id == id){
				index = i;
				break;
			}
		}

		return index;
	},

	render: function() {
		var cssClass = this.state.allData.length == 0 ? "hide" : "show";

		return (
			<div className="todoapp">
				<div className="panel panel-default">
					
					<Header addToDoItem={this.addToDoItem}  
							onCompleteAllStatusChange={this.changeCompleteAllStatus} />

					<ToDoItemsList 	items={this.state.data} 
									onEditToDoItem={this.editToDoItem} 
									onDeleteToDoItem={this.deleteToDoItem}
									onCompleteStatusChange={this.changeCompleteStatus}
									onGetIndexById={this.getIndexById}
									cssClass={cssClass} /> 
				
					<Footer statistics={this.getStatistics()} cssClass={cssClass}
							onViewButtonSelection={this.viewButtonSelection} 
							onClearButtonSelection={this.clearButtonSelection} />
				</div>	
			</div>

			
		);
	}
});

var Header = React.createClass({
	getInitialState: function(){
		return (
			{
				newText: "",
				isAllCompleted: false
			}
		);
	},

	handleToDoItemTextChange: function(e){
		this.setState({newText: e.target.value});
	},

	handleAddToDoItem: function(){
		if(this.state.newText.trim() != ""){
			this.props.addToDoItem(this.state.newText);
			this.setState({newText: ""});	
		}
		else{
			alert("ToDo item text must be present.");
		}
		
	},

	handleCheckChange: function(){
		var completed = !this.state.isAllCompleted;
		this.props.onCompleteAllStatusChange(completed);
		this.setState({isAllCompleted: completed});
	},

	render: function(){
		return (
			<div className="panel-heading padding-20-15">
				<h1 className="panel-title">MY TODO APP</h1>
				<div className="input-group margin-top-15">
					<span className="input-group-addon">
						<input type="checkbox" defaultChecked={this.state.isAllCompleted} onChange={this.handleCheckChange} disabled />
					</span>
					<input type="text" className="form-control" value={this.state.newText} onChange={this.handleToDoItemTextChange} placeholder="What needs to be done?" />
					<span className="input-group-btn">
			        	<button className="btn btn-default" onClick={this.handleAddToDoItem}>ADD</button>
			      	</span>
				</div>
			</div>
		);
	}
});

var ToDoItemsList = React.createClass({
	render: function(){
		var todoItems = this.props.items.map(function(item, i){

			return (
				<ToDoItem key={item.id} index={this.props.onGetIndexById(item.id)} item={item} 
						cssClass={item.completed? "completed" : "not-completed"}
						editToDoItem={this.props.onEditToDoItem} 
						deleteToDoItem={this.props.onDeleteToDoItem} 
						completeStatusChange={this.props.onCompleteStatusChange} />
			);
		}, this);

		return (
			<div className={"panel-body " + this.props.cssClass}>
				<div className="todolist">
			  		{
			  			todoItems
			  		}
				</div>
			</div>
		);
	}
});

var ToDoItem = React.createClass({
	getInitialState: function(){
		return (
			{
				cssClass: this.props.cssClass,
				completed: this.props.item.completed,
				editing: false
			}
		);
	},

	handleEditClick: function(){
		this.setState({editing: true});
	},

	handleSaveClick: function(){
		var newText = this.refs.newToDoItemText.value;
		if (newText.trim() != "") {
			this.props.editToDoItem(newText, this.props.index);
			this.setState({editing: false});
		}
		else {
			alert("ToDo item text must be present.");
		}
	},

	handleCancelClick: function(){
		this.setState({editing: false});
	},

	handleDeleteClick: function(){
		this.props.deleteToDoItem(this.props.index);
	},

	handleCheckChange: function(){
		var completed = !this.state.completed;
		var index = this.props.index;
		
		this.setState({cssClass: completed? "completed" : "not-completed", completed: completed});

		this.props.completeStatusChange(completed, index);
	},

	
	renderDisplay: function(){
		
		return (
	  		<div className="input-group margin-bottom-3">
				<span className="input-group-addon no-border-radius">
					<input 	type="checkbox" aria-label="mark all as completed" 
							defaultChecked={this.state.completed} 
							onChange={this.handleCheckChange} />
				</span>
				<label className={"form-control " + this.state.cssClass}>{this.props.item.text}</label>
				
				<span className="input-group-btn">
		        	<button className="btn btn-default no-border-radius" type="button" onClick={this.handleEditClick}>
		        		<span className="glyphicon glyphicon-pencil"></span>
		        	</button>
		      	</span>

				<span className="input-group-btn">
		        	<button className="btn btn-default no-border-radius" onClick={this.handleDeleteClick} >
		        		<span className="glyphicon glyphicon-remove"></span>
		        	</button>
		      	</span>
			</div>
		);
	},

	renderEdit: function(){
		return (
	  		<div className="input-group margin-bottom-3">
				<span className="input-group-addon no-border-radius">
					<input type="checkbox" aria-label="mark all as completed" defaultChecked={this.state.completed} disabled />
				</span>
				<input type="text" ref="newToDoItemText" className="form-control" defaultValue={this.props.item.text} />
				<span className="input-group-btn">
		        	<button className="btn btn-default no-border-radius" type="button" onClick={this.handleSaveClick}>
		        		<span className="glyphicon glyphicon-floppy-saved"></span>
		        	</button>
		      	</span>

				<span className="input-group-btn">
		        	<button className="btn btn-default no-border-radius" type="button" onClick={this.handleCancelClick}>
		        		<span className="glyphicon glyphicon-floppy-remove"></span>
		        	</button>
		      	</span>
			</div>
		);
	},

	render: function(){
		if (this.state.editing){
			return this.renderEdit();
		}
		else{
			return this.renderDisplay();
		}
	}
});

var Footer = React.createClass({
	handleViewButtonSelection: function(itemsToView){
		this.props.onViewButtonSelection(itemsToView);
	},

	handleClearButtonSelection: function(itemsToClear){
		this.props.onClearButtonSelection(itemsToClear);
	},

	render: function(){
		return (
			<div className={"panel-footer " + this.props.cssClass} >
				<div>
					<Actions viewButtonSelection={this.handleViewButtonSelection} clearButtonSelection={this.handleClearButtonSelection} />
					<Statistics statistics={this.props.statistics} />
				</div>
			</div>
		);
	}
});

var Statistics = React.createClass({
	render: function(){
		return (
			<div className="margin-top-15 center">
				<ul className="list-inline" role="tablist">
					<li roleName="presentation">
						All ToDo Items: <span className="badge">{this.props.statistics.all}</span>&nbsp;&nbsp;&nbsp;|&nbsp;
					</li>
					<li role="presentation">Completed ToDo Items: <span className="badge">{this.props.statistics.completed}</span>&nbsp;&nbsp;&nbsp;|&nbsp;</li>
					<li role="presentation">Not Completed ToDo Items: <span className="badge">{this.props.statistics.notCompleted}</span></li>
				</ul>
			</div>
		);
	}
});

var Actions = React.createClass({
	viewAllButton: function(){
		this.props.viewButtonSelection("all");
	},

	viewCompletedButton: function(){
		this.props.viewButtonSelection("completed");
	},

	viewNotCompletedButton: function(){
		this.props.viewButtonSelection("not-completed");
	},

	clearAllButton: function(){
		this.props.clearButtonSelection("all");
	},

	clearCompletedButton: function(){
		this.props.clearButtonSelection("completed");
	},

	clearNotCompletedButton: function(){
		this.props.clearButtonSelection("not-completed");
	},

	render: function(){
		return (
			<div className="margin-top-15">
				<div className="btn-group btn-group-justified" role="group" aria-label="...">
					<div className="btn-group" role="group">
						<button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
							View &nbsp;
							<span className="caret"></span>
						</button>
						<ul className="dropdown-menu">
							<li><a onClick={this.viewAllButton}>All</a></li>
							<li><a onClick={this.viewCompletedButton}>Completed</a></li>
							<li><a onClick={this.viewNotCompletedButton}>Not Completed</a></li>
						</ul>
					</div>
					<div className="btn-group" role="group">
						<button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
							Clear &nbsp;
							<span className="caret"></span>
						</button>
						<ul className="dropdown-menu">
							<li><a onClick={this.clearAllButton}>All</a></li>
							<li><a onClick={this.clearCompletedButton}>Completed</a></li>
							<li><a onClick={this.clearNotCompletedButton}>Not Completed</a></li>
						</ul>
					</div>
	  			</div>
	  		</div>
		);
	}
});

ReactDOM.render(<ToDoApp />, document.getElementById("react-container"));