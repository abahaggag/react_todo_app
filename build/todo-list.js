var ToDoApp = React.createClass({displayName: "ToDoApp",
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
			React.createElement("div", {className: "todoapp"}, 
				React.createElement("div", {className: "panel panel-default"}, 
					
					React.createElement(Header, {addToDoItem: this.addToDoItem, 
							onCompleteAllStatusChange: this.changeCompleteAllStatus}), 

					React.createElement(ToDoItemsList, {	items: this.state.data, 
									onEditToDoItem: this.editToDoItem, 
									onDeleteToDoItem: this.deleteToDoItem, 
									onCompleteStatusChange: this.changeCompleteStatus, 
									onGetIndexById: this.getIndexById, 
									cssClass: cssClass}), 
				
					React.createElement(Footer, {statistics: this.getStatistics(), cssClass: cssClass, 
							onViewButtonSelection: this.viewButtonSelection, 
							onClearButtonSelection: this.clearButtonSelection})
				)	
			)

			
		);
	}
});

var Header = React.createClass({displayName: "Header",
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
			React.createElement("div", {className: "panel-heading padding-20-15"}, 
				React.createElement("h1", {className: "panel-title"}, "MY TODO APP"), 
				React.createElement("div", {className: "input-group margin-top-15"}, 
					React.createElement("span", {className: "input-group-addon"}, 
						React.createElement("input", {type: "checkbox", defaultChecked: this.state.isAllCompleted, onChange: this.handleCheckChange, disabled: true})
					), 
					React.createElement("input", {type: "text", className: "form-control", value: this.state.newText, onChange: this.handleToDoItemTextChange, placeholder: "What needs to be done?"}), 
					React.createElement("span", {className: "input-group-btn"}, 
			        	React.createElement("button", {className: "btn btn-default", onClick: this.handleAddToDoItem}, "ADD")
			      	)
				)
			)
		);
	}
});

var ToDoItemsList = React.createClass({displayName: "ToDoItemsList",
	render: function(){
		var todoItems = this.props.items.map(function(item, i){

			return (
				React.createElement(ToDoItem, {key: item.id, index: this.props.onGetIndexById(item.id), item: item, 
						cssClass: item.completed? "completed" : "not-completed", 
						editToDoItem: this.props.onEditToDoItem, 
						deleteToDoItem: this.props.onDeleteToDoItem, 
						completeStatusChange: this.props.onCompleteStatusChange})
			);
		}, this);

		return (
			React.createElement("div", {className: "panel-body " + this.props.cssClass}, 
				React.createElement("div", {className: "todolist"}, 
			  		
			  			todoItems
			  		
				)
			)
		);
	}
});

var ToDoItem = React.createClass({displayName: "ToDoItem",
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
	  		React.createElement("div", {className: "input-group margin-bottom-3"}, 
				React.createElement("span", {className: "input-group-addon no-border-radius"}, 
					React.createElement("input", {	type: "checkbox", "aria-label": "mark all as completed", 
							defaultChecked: this.state.completed, 
							onChange: this.handleCheckChange})
				), 
				React.createElement("label", {className: "form-control " + this.state.cssClass}, this.props.item.text), 
				
				React.createElement("span", {className: "input-group-btn"}, 
		        	React.createElement("button", {className: "btn btn-default no-border-radius", type: "button", onClick: this.handleEditClick}, 
		        		React.createElement("span", {className: "glyphicon glyphicon-pencil"})
		        	)
		      	), 

				React.createElement("span", {className: "input-group-btn"}, 
		        	React.createElement("button", {className: "btn btn-default no-border-radius", onClick: this.handleDeleteClick}, 
		        		React.createElement("span", {className: "glyphicon glyphicon-remove"})
		        	)
		      	)
			)
		);
	},

	renderEdit: function(){
		return (
	  		React.createElement("div", {className: "input-group margin-bottom-3"}, 
				React.createElement("span", {className: "input-group-addon no-border-radius"}, 
					React.createElement("input", {type: "checkbox", "aria-label": "mark all as completed", defaultChecked: this.state.completed, disabled: true})
				), 
				React.createElement("input", {type: "text", ref: "newToDoItemText", className: "form-control", defaultValue: this.props.item.text}), 
				React.createElement("span", {className: "input-group-btn"}, 
		        	React.createElement("button", {className: "btn btn-default no-border-radius", type: "button", onClick: this.handleSaveClick}, 
		        		React.createElement("span", {className: "glyphicon glyphicon-floppy-saved"})
		        	)
		      	), 

				React.createElement("span", {className: "input-group-btn"}, 
		        	React.createElement("button", {className: "btn btn-default no-border-radius", type: "button", onClick: this.handleCancelClick}, 
		        		React.createElement("span", {className: "glyphicon glyphicon-floppy-remove"})
		        	)
		      	)
			)
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

var Footer = React.createClass({displayName: "Footer",
	handleViewButtonSelection: function(itemsToView){
		this.props.onViewButtonSelection(itemsToView);
	},

	handleClearButtonSelection: function(itemsToClear){
		this.props.onClearButtonSelection(itemsToClear);
	},

	render: function(){
		return (
			React.createElement("div", {className: "panel-footer " + this.props.cssClass}, 
				React.createElement("div", null, 
					React.createElement(Actions, {viewButtonSelection: this.handleViewButtonSelection, clearButtonSelection: this.handleClearButtonSelection}), 
					React.createElement(Statistics, {statistics: this.props.statistics})
				)
			)
		);
	}
});

var Statistics = React.createClass({displayName: "Statistics",
	render: function(){
		return (
			React.createElement("div", {className: "margin-top-15 center"}, 
				React.createElement("ul", {className: "list-inline", role: "tablist"}, 
					React.createElement("li", {roleName: "presentation"}, 
						"All ToDo Items: ", React.createElement("span", {className: "badge"}, this.props.statistics.all), "   | "
					), 
					React.createElement("li", {role: "presentation"}, "Completed ToDo Items: ", React.createElement("span", {className: "badge"}, this.props.statistics.completed), "   | "), 
					React.createElement("li", {role: "presentation"}, "Not Completed ToDo Items: ", React.createElement("span", {className: "badge"}, this.props.statistics.notCompleted))
				)
			)
		);
	}
});

var Actions = React.createClass({displayName: "Actions",
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
			React.createElement("div", {className: "margin-top-15"}, 
				React.createElement("div", {className: "btn-group btn-group-justified", role: "group", "aria-label": "..."}, 
					React.createElement("div", {className: "btn-group", role: "group"}, 
						React.createElement("button", {type: "button", className: "btn btn-default dropdown-toggle", "data-toggle": "dropdown", "aria-haspopup": "true", "aria-expanded": "false"}, 
							"View  ", 
							React.createElement("span", {className: "caret"})
						), 
						React.createElement("ul", {className: "dropdown-menu"}, 
							React.createElement("li", null, React.createElement("a", {onClick: this.viewAllButton}, "All")), 
							React.createElement("li", null, React.createElement("a", {onClick: this.viewCompletedButton}, "Completed")), 
							React.createElement("li", null, React.createElement("a", {onClick: this.viewNotCompletedButton}, "Not Completed"))
						)
					), 
					React.createElement("div", {className: "btn-group", role: "group"}, 
						React.createElement("button", {type: "button", className: "btn btn-default dropdown-toggle", "data-toggle": "dropdown", "aria-haspopup": "true", "aria-expanded": "false"}, 
							"Clear  ", 
							React.createElement("span", {className: "caret"})
						), 
						React.createElement("ul", {className: "dropdown-menu"}, 
							React.createElement("li", null, React.createElement("a", {onClick: this.clearAllButton}, "All")), 
							React.createElement("li", null, React.createElement("a", {onClick: this.clearCompletedButton}, "Completed")), 
							React.createElement("li", null, React.createElement("a", {onClick: this.clearNotCompletedButton}, "Not Completed"))
						)
					)
	  			)
	  		)
		);
	}
});

ReactDOM.render(React.createElement(ToDoApp, null), document.getElementById("react-container"));