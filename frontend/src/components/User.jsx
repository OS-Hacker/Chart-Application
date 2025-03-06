const User = ({ users }) => {
  return (
    <div className="">
      {users?.length > 0 ? (
        <>
          {users?.map((user) => {
            const { _id, userName, email, profileImage } = user;
            return (
              <div
                className="card-body hover:bg-slate-800 p-3 rounded-4 ml-5 cursor-pointer"
                key={_id}
              >
                <div className="card-actions gap-5">
                  <div className="avatar avatar-online">
                    <div className="w-13 rounded-full">
                      <img
                        src={`${
                          import.meta.env.VITE_BASE_URL
                        }/uploads/${profileImage}`}
                        alt="User Profile"
                      />
                    </div>
                  </div>
                  <div className="">
                    <h1 className="card-title">{userName}</h1>
                    <h4>{email}</h4>
                  </div>
                </div>
              </div>
            );
          })}
        </>
      ) : (
        <div className="flex justify-center align-center text-sm text-gray-400"><p>No results</p></div>
      )}
    </div>
  );
};

export default User;
