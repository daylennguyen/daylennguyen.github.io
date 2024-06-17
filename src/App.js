import "./App.css";

function App() {
  return (
    <div className="min-h-full divide-y divide-gray-200 overflow-hidden rounded-lg bg-black p-3 shadow text-white	size-full">
      <div className="px-4 py-5 sm:px-6 flex justify-center">card header</div>
      <div className="px-4 py-5 sm:p-6  flex justify-center h-screen">card content</div>
      <div className="px-4 py-4 sm:px-6 flex justify-center">card footer</div>
    </div>
  );
}

export default App;
