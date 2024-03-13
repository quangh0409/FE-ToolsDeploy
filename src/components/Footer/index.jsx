import React from "react";

export default function Footer() {
  return (
    <div className="mt-auto">
      <hr></hr>
      <div className="flex h-20 justify-between">
        <div className="grid grid-cols-4 w-96 items-center justify-center ml-3">
        <div className="col-span-2 text-2xl ml-3 text-center">Facebook</div>
        <div className="col-span-2 text-2xl ml-3 text-center">Github</div>
        </div>
        <div className=" flex text-2xl mr-3 text-center items-center justify-center">02</div>
      </div>
    </div>
  );
}
