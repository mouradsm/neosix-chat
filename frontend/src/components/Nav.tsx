import UserCard from "../components/UserCard";

const Nav = () => {
  const users = [
    {
      id: 1,
      name: "Diego Moura",
    },
    {
      id: 2,
      name: "Hildean Dantas",
    },
    {
      id: 3,
      name: "Ramon Nunes",
    },
  ];

  return (
    <nav className="">
      <ul className="list-none">
        <li>
            <UserCard user={{name: 'General', id: 'general'}}/>
        </li> 
        {users.map((user, index) => (
          <li key={index}>
            <UserCard user={user}/>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Nav;
