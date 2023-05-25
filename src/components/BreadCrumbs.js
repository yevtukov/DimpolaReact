import React from 'react';
import {Link} from 'react-router-dom';

const BreadCrumbs = ({path}) => {
  const pathList = path.map(({title, link}, i) => title && (
    <li className="site-path__item" key={title + i}>
      {link ?
        (<Link to={link}>{title}</Link>) :
        (<span>{title}</span>)
      }
    </li>
  ));

  return (
    <div className="site-path">
      <ul className="site-path__items">
        <li className="site-path__item"><Link to="/">Главная</Link></li>
        {pathList}
      </ul>
    </div>
  )
};

BreadCrumbs.defaultProps = {
  path: [{title: ''}]
};

export default BreadCrumbs
