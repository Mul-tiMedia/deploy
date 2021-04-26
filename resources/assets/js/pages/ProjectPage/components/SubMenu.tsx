import * as React from 'react';
import { NavLink } from 'react-router-dom';
import ProjectModelInterface from '../../../interfaces/model/ProjectModelInterface';

const SubMenu = (props: PropsInterface) => {
  const { project } = props;

  return (
    <div className="container content submenu">
      <ul>
        <li><NavLink activeClassName="active" to={'/projects/' + project.id}>Project Overview</NavLink></li>
        <li><NavLink activeClassName="active" to={'/projects/' + project.id + '/environment-unlock'}>Environment</NavLink></li>
        <li><NavLink activeClassName="active" to={'/projects/' + project.id + '/deployment-hooks'}>Deployment Hooks</NavLink></li>
        <li><NavLink activeClassName="active" to={'/projects/' + project.id + '/folders'}>Linked Folders</NavLink></li>
      </ul>
    </div>
  )
};

interface PropsInterface {
  project: ProjectModelInterface
}

export default SubMenu;
