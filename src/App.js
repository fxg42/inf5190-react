import React, { useState, useRef } from 'react';

const UserItem = ({ user, setSelectedUser }) =>
  <div className='media'>
    <div className='media-left'>
      <button className='btn btn-link' onClick={() => setSelectedUser(user) }>
        <img src={user.avatar_url} style={ {width:'64px'} } className='img-circle' alt='' />
      </button>
    </div>
    <div className='media-body'>
      <h4 className='media-heading'>{user.login}</h4>
      <p>{ user.bio || user.name || user.company || user.location || user.created_at }</p>
    </div>
  </div>

const UserCollectionView = (props) => {
  const { users, ...other } = props;

  return (
    <div className='col-md-3'>
      { users.map((user) =>
        <UserItem key={ user.login } user={ user } { ...other } />
      )}
    </div>
  );
}

const UserDetailsView = ({ user }) =>
  <div className='col-md-7'>
    <h2>{ user.name }</h2>
    { user.location ? <p><span className='glyphicon glyphicon-map-marker'></span> { user.location }</p> : null }
    { user.company ? <p><span className='glyphicon glyphicon-briefcase'></span> { user.company }</p> : null }
    <p><span className='glyphicon glyphicon-time'></span> Joined on { user.created_at.slice(0,10) }</p>
    <h3>Repositories</h3>
    { user.repos.map((repo) =>
      <h4 key={ repo.id }>
        <a href={ repo.html_url }>{ repo.name }</a> <small>{ repo.description }</small>
      </h4>
    )}
  </div>

const UserSearch = (props) => {
  const searchInput = useRef(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    const userResp = await fetch(`https://api.github.com/users/${ searchInput.current.value }`);
    if (userResp.status === 200) {
      const user = await userResp.json();
      const repoResp = await fetch(user.repos_url);
      const repos = await repoResp.json();
      user.repos = repos || [ ];
      props.addNewUser(user);
    }
  };

  return (
    <form className='navbar-form navbar-left' role='search' onSubmit={ onSubmit }>
      <div className='form-group'>
        <input ref={ searchInput } type='text' className='form-control' placeholder='search users e.g. fxg42' />
      </div>
    </form>
  );
}

const App = (props) => {
  const [ selectedUser, setSelectedUser ] = useState(null);
  const [ users, setUsers ] = useState([ ]);

  const addNewUser = (newUser) => {
    setSelectedUser(newUser);
    setUsers([ ...users, newUser ]);
  };

  return (
    <>
      <nav className='navbar navbar-default'>
        <div className='container'>
          <a href='/' className='navbar-brand'>Github users</a>
          <UserSearch addNewUser={ addNewUser } />
        </div>
      </nav>
      <div className='container'>
        <div className='row'>
          <UserCollectionView users={ users } setSelectedUser={ setSelectedUser } />
          { selectedUser ? <UserDetailsView user={ selectedUser } /> : null }
        </div>
      </div>
    </>
  );
}

export default App;
