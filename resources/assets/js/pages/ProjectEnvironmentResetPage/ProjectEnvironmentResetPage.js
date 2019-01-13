import React from 'react';
import { Link } from 'react-router-dom';
import { Deploy } from '../../config';

import ProjectService from '../../services/Project';
import ProjectEnvironmentResetService from '../../services/ProjectEnvironmentReset';

import Alert from '../../components/Alert';
import AlertErrorValidation from '../../components/AlertErrorValidation'; 
import Button from '../../components/Button';
import Icon from '../../components/Icon';
import TextField from '../../components/TextField';
import Panel from '../../components/Panel';
import PanelBody from '../../components/PanelBody';

export default class ProjectEnvironmentResetPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isFetching: true,
      project: {},
      key: '',
      errors: []
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentWillMount() {
    const projectService = new ProjectService;

    projectService
      .get(this.props.match.params.project_id)
      .then(response => {
        this.setState({
          isFetching: false,
          project: response.data
        });
      });
  }

  handleInputChange(event) {
    const value = event.target.value;
    this.setState({key: value});
  }

  handleClick() {
    const { project, key } = this.state;
    const projectEnvironmentResetService = new ProjectEnvironmentResetService;

    projectEnvironmentResetService
      .update(project.id, {key: key})
      .then(response => {
        this.setState({errors: []});

        alert('Environment key was successfully reset');
      },
      error => {
        const errorResponse = error.response.data;
        
        const errors = Object.keys(errorResponse).reduce(function(previous, key) {
          return previous.concat(errorResponse[key][0]);
        }, []);
        
        this.setState({errors: errors});
      });
  }

  render() {
    const { 
      project,
      key,
      errors
    } = this.state;

    return (
      <div>
        <div className="breadcrumbs">
          <div className="container">
            <div className="pull-left">
              <span className="heading">
                <Link to={Deploy.path + '/projects/' + project.id}>{project.name}</Link> <Icon iconName="angle-double-right" /> Reset Environment Key
              </span>
            </div>
          </div>
        </div>

        <div class="container content">
          <Alert type="warning">
            Resetting your environment key will also clear the environment contents.
          </Alert>

          <Panel>
            <PanelBody>
              {errors.length ? <AlertErrorValidation errors={errors} /> : ''}

              <div class="form-group">
                <TextField
                  label="Key"
                  name="key"
                  type="password"
                  onChange={this.handleInputChange}
                  value={key}
                />
              </div>
              <div className="form-group">
                <Button
                  onClick={this.handleClick}
                >Reset Environment Key</Button>
              </div>
              <Link
                to={Deploy.path + '/projects/' + project.id + '/environment-unlock'}
              >Update Environment</Link>
            </PanelBody>
          </Panel>
        </div>
      </div>
    )
  }
}