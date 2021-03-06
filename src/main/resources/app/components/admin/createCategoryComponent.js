
import React from 'react';

// Material UI 
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

// Stylesheet
import '../../styles/createCategoryComponent.less'

export default class CreateItemComponent extends React.PureComponent {
    constructor(arg) {
        super(arg)
        const {categoryToBeEdited} = this.props;
        this.state = {
            title: categoryToBeEdited ? categoryToBeEdited.title : "",
            filter: categoryToBeEdited ? categoryToBeEdited.filter : "",
            id: categoryToBeEdited ? categoryToBeEdited.id : null
        };
    }

    handleChange(event) {
        this.setState({ [event.target.id]: event.target.value })
    }

    handleVisibleChange = event => {
        this.setState({visible : !this.state.visible})
    }

    validateAndSubmit() {
        if(this.state.title !== "" && this.state.filter !== "") {
            this.props.submit(this.state);
            this.props.onClose()
        }
    }

    render() {
        return (
            <div className="CreateCategoryComponent">
                <form>
                    <FormControl   className="item-formcontrol" >
                        <TextField
                            label="Title"
                            id="title"
                            value={this.state.title}
                            margin="normal"
                            onChange={this.handleChange.bind(this)}
                            required
                            error={this.state.title === ""}
                        />
                    </FormControl>
                    <FormControl className="item-formcontrol"> 
                        <TextField
                            label="Filter"
                            id="filter"
                            value={this.state.filter}
                            margin="normal"
                            onChange={this.handleChange.bind(this)}
                            required
                            error={this.state.filter === ""}
                        />
                    </FormControl>
                </form>

                <DialogActions>
                    <Button onClick={() =>this.props.onClose()} className="Greyed-Button">
                        Cancel
                    </Button>
                    <Button onClick={this.validateAndSubmit.bind(this)} color="primary">
                        {this.props.categoryToBeEdited ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>

            </div>

        )
    }
}