export default function Login () {
  return (
    <div className="container">
      <h2>Login</h2>
      <p>This page will allow users to log in to their account.</p>
      {/* You can add a form here for users to input login details */}
      <form>
        <div>
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" name="username" required />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}