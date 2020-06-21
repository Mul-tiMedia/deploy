import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { createToast } from '../../state/alert/alertActions';
import ProjectFolderService from '../../services/ProjectFolder';

import Icon from '../../components/Icon';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';
import Panel from '../../components/Panel';
import PanelHeading from '../../components/PanelHeading';
import PanelTitle from '../../components/PanelTitle';
import FoldersTable from './FoldersTable';
import Layout from "../../components/Layout";
import Container from "../../components/Container";
import {fetchProject} from "../../state/project/actions";
import ProjectHeading from '../../components/ProjectHeading/ProjectHeading';

class ProjectLinkedFolderPage extends React.Component {
  state = {
    isFetching: true,
    folders: [],
    folder: {}
  };

  componentDidMount() {
    const {
      dispatch,
      project,
      match: {
        params: {
          project_id,
        }
      }
    } = this.props;

    const projectFolderService = new ProjectFolderService;

    dispatch(fetchProject(project_id));

    projectFolderService
      .list(project_id)
      .then(response => {
        this.setState({
          folders: response.data,
          isFetching: false
        });
      });
  }

  /**
   * Handle show folder remove modal.
   *
   * @param {object} folder
   */
  modalLinkedFolderRemoveShow = (folder) => {
    this.setState({folder: folder});

    $('#linked-folder-remove-modal').modal('show');
  };

  /**
   * Handle project folder delete.
   */
  handleLinkedFolderRemoveClick = () => {
    const { folder } = this.state;
    const { project, dispatch } = this.props;
    const projectFolderService = new ProjectFolderService;

    projectFolderService
      .delete(project.item.id, folder.id)
      .then(response => {
        dispatch(createToast('Folder removed successfully.'));

        this.removeFolder(folder.id);

        $('#linked-folder-remove-modal').modal('hide');
      },
      error => {
        alert('Could not delete linked folder');
      });
  };

  /**
   * Filter out specified folder from state.
   *
   * @param {int} folder_id
   */
  removeFolder = (folder_id) => {
    this.setState(state => {
      const folders = state.folders.filter(folder => {
        return folder.id !== folder_id;
      });
      return {folders: folders}
    });
  };

  /**
   * Render folders table.
   *
   * @param {array} folders
   * @returns {XML}
   */
  renderFoldersTable = (folders) => {
    if (folders !== undefined && folders.length > 0) {
      return (
        <FoldersTable
          folders={folders}
          modalLinkedFolderRemoveShow={this.modalLinkedFolderRemoveShow}
        />
      )
    }

    return (
      <div className="panel-body hooks-placeholder">
        No folders have been added.
      </div>
    )
  };

  /**
   * Render folders content.
   *
   * @param {bool} isFetching
   * @param {object} project
   * @param {array} folders
   * @returns {XML}
   */
  renderFoldersContent = (isFetching, project, folders) => {
    if (isFetching) {
      return <Loader />;
    }

    return (
      <>
        <Panel>
          <PanelHeading>
            <div className="pull-right">
	          <Link
	            className="btn btn-default"
	            to={'/projects/' + project.id + '/folders/create'}
	          ><Icon iconName="plus" /> Add Linked Folder</Link>
	        </div>
            <PanelTitle>Linked Folders</PanelTitle>
          </PanelHeading>
          {this.renderFoldersTable(folders)}
        </Panel>
      </>
    )
  };

  render() {
    const { project } = this.props;
    const { folders, isFetching } = this.state;

    return (
      <Layout project={project.item}>
        <ProjectHeading project={ project.item } />

        <div className="content">
          <Container fluid>
            {this.renderFoldersContent(isFetching, project.item, folders)}
          </Container>

          <Modal
            id="linked-folder-remove-modal"
            title="Remove Linked Folder"
            buttons={[
              {text: 'Cancel', onPress: () => $('#linked-folder-remove-modal').modal('hide')},
              {text: 'Remove Linked Folder', onPress: () => this.handleLinkedFolderRemoveClick()}
            ]}
          >
            Are you sure you want to remove this link folder from the project?
            <br/>
            Note: Your folder will not be removed from the server. This will
            only prevent a symlink during your next deploy.
          </Modal>
        </div>
      </Layout>
    )
  }
}

const mapStateToProps = state => {
  return {
    project: state.project,
  };
};

export default connect(
  mapStateToProps
)(ProjectLinkedFolderPage);
