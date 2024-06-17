import "./App.css";

function App() {
  return (
    <div className="h-full divide-y divide-gray-200 overflow-hidden rounded-lg bg-black p-3 text-white shadow">
      <div className="flex justify-center px-4 py-5 sm:px-6">
        <img
          className="h-48 w-48 rounded-full"
          src="./me.jpg"
          alt=""
        />
      </div>
      <div className="flex h-screen justify-center px-4 py-5 sm:p-6">
        card content
      </div>
      <div className="flex justify-center px-4 py-4 sm:px-6">card footer</div>
    </div>
  );
}

export default App;
