import React from 'react';
import { connect } from 'react-redux';

import {
  fetchProjects,
  projectsCreateFailure,
  projectsCreateRequest,
  projectsCreateSuccess
} from '../../state/projects/projectsActions';

import AccountProviderService from '../../services/AccountProvider';
import AddProjectDialog from './AddProjectDialog';
import Icon from '../../components/Icon';
import Button from '../../components/Button';
import Panel from '../../components/Panel';
import ProjectsTable from './ProjectsTable';
import Layout from "../../components/Layout";
import ProjectService from "../../services/Project";
import Container from "../../components/Container";
import Alert from '../../components/Alert';

class DashboardPage extends React.Component {
  state = {
    grantedProviders: [],
    input: {}
  };

  /**
   * Fetch data for projects and providers.
   */
  componentDidMount() {
    const {
      dispatch,
      projects
    } = this.props;

    let accountProviderService = new AccountProviderService;

    if (typeof projects.items === 'object' && projects.items.length === 0) {
      dispatch(fetchProjects());
    }

    accountProviderService
      .index('/api/account-providers')
      .then(response => {
        let providers = response.data.filter(provider => {
          return provider.deploy_access_token;
        });

        this.setState({ grantedProviders: providers });
      });
  }

  /**
   * Handle input change from the project add form.
   *
   * @param {object} event
   */
  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    let input = Object.assign({}, this.state.input);
    input[name] = value;

    this.setState({input: input});
  };

  /**
   * Handles creating the project once the form button is clicked.
   */
  handleCreateProjectClick = () => {
    const { dispatch } = this.props;
    const projectService = new ProjectService();

    dispatch(projectsCreateRequest());

    projectService
      .post(this.state.input)
      .then(response => {
          dispatch(projectsCreateSuccess(response.data));
          $('#project-create-modal').modal('hide');
        },
        error => {
          dispatch(projectsCreateFailure(error.response));
        });
  };

  /**
   * Handle click for displaying the create project modal.
   */
  handleShowModalClick = () => {
    $('#project-create-modal').modal('show');
  };

  /**
   * Handle click for dismissing the create project modal.
   */
  handleDismissModalClick = () => {
    $('#project-create-modal').modal('hide');
  };

  /**
   * Return list of warnings.
   *
   * @returns {array}
   */
  warnings = () => {
    return window.Deploy.warnings || [];
  }

  render() {
    const { projects } = this.props;

    const items = Object.keys(projects.items).map(key => {
      return projects.items[key];
    });

    const warnings = this.warnings();

    return (
      <Layout>
        <div className="content">
          <Container fluid>
            <div className="pull-left heading">
              <h2>Project List</h2>
            </div>
            <div className="pull-right">
              <Button color="primary" onClick={this.handleShowModalClick}>
                <Icon iconName="plus" /> Add Project
              </Button>
            </div>

            {}
          </Container>

          {warnings.length > 0 ?
            <Container fluid>
              <Alert type="warning">
                <p>The following warnings have occurred:</p>

                <ul>
                  {warnings.map(warning =>
                    <li key={ warning.code }>{ warning.message }</li>
                  )}
                </ul>
              </Alert>
            </Container>
          : ''}

          <Container fluid>
            <Panel>
              <ProjectsTable
                isFetching={projects.isFetching}
                projects={items}
              />
            </Panel>
          </Container>

          <AddProjectDialog
            projects={projects}
            grantedProviders={this.state.grantedProviders}
            handleCreateProjectClick={this.handleCreateProjectClick}
            handleDismissModalClick={this.handleDismissModalClick}
            handleInputChange={this.handleInputChange}
          />
        </div>
      </Layout>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    projects: state.projects
  };
};

export default connect(
  mapStateToProps
)(DashboardPage);