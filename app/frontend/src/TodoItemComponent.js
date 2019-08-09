import React, {Component} from 'react';
var axios = require("axios");
var config = require("./config");

class TodoItemComponent extends Component {
    constructor() {
        super();
        this.state = {
            items: [],
            newItem: ""
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount = async() => {
        await this.refreshList();
    }

    refreshList = async() => {
        var url = config.backend + "/items";
        var items = await axios.get(url);
        this.setState({items: items.data});
    }

    handleSubmit = async(event) => {
        event.preventDefault();
        var payload = {
            item: this.state.newItem
        }

        await axios.put(config.backend+"/items", payload);

        this.setState({newItem: ""});
        await this.refreshList();
    }

    handleChange = async(event) => {
        var payload = {};
        payload[event.target.name] = event.target.value;
        this.setState(payload);
    }

    render() {
        return (
            <div>
                <h3>Todo Items</h3>
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    {this.state.items.map(item => {
                        return (
                            <tr>
                                <td>{item.id}</td>
                                <td>{item.item}</td>
                            </tr>
                        );
                    })}
                </table>
                <hr />
                <h4>New Item</h4>
                <div>
                    <form method="POST" onSubmit={this.handleSubmit}>
                        <div className="form-group">
                            <label for="newItem">Description</label>
                            <input type="text" className="form-control" name="newItem" value={this.state.newItem} onChange={this.handleChange} />
                        </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>

                </div>
            </div>
            
        );
    }
}

export default TodoItemComponent;