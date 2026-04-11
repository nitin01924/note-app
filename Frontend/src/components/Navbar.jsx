import Button from "./Button";

 function Navbar(params) {
     return (
    <div className="flex justify-between items-center px-6 py-3 shadow">
      <h1 className="font-bold">Notes</h1>
      <Button>Logout</Button>
    </div>
  );
    
}
export default Navbar;
