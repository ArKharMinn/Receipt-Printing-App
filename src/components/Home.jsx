import React, { useState, useRef } from "react";

const Home = () => {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [storeName, setStoreName] = useState("My Store");
  const [taxRate, setTaxRate] = useState(10);
  const printRef = useRef();

  const addItem = () => {
    if (itemName && itemPrice) {
      const newItem = {
        name: itemName,
        price: parseFloat(itemPrice),
      };
      setItems([...items, newItem]);
      setItemName("");
      setItemPrice("");
      // Auto-focus on item name input after adding
      document.getElementById("itemNameInput")?.focus();
    }
  };

  const removeItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.price, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * (taxRate / 100);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const printWindow = window.open("", "", "width=300,height=600");
    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt</title>
          <style>
            body { 
              font-family: 'Courier New', monospace; 
              padding: 20px;
              max-width: 250px;
              margin: 0 auto;
            }
            .center { text-align: center; }
            .bold { font-weight: bold; }
            .divider { border-top: 1px dashed #000; margin: 10px 0; }
            .items { margin: 15px 0; }
            .item-row { display: flex; justify-content: space-between; }
            .total-row { font-weight: bold; margin-top: 10px; }
            .thank-you { margin-top: 20px; font-style: italic; }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Handle Enter key press for quick item addition
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addItem();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 p-4 md:p-6 text-white">
          <h1 className="text-xl md:text-2xl font-bold">
            Point of Sale System
          </h1>
        </div>

        {/* Main Content */}
        <div className="p-4 md:p-6">
          <div className="flex flex-col gap-4">
            {/* Store Info Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Store Name
                </label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Store Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tax Rate"
                />
              </div>
            </div>

            {/* Add Items Section */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-3">Add Items</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Item Name
                  </label>
                  <input
                    id="itemNameInput"
                    type="text"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Item Name"
                    onKeyPress={handleKeyPress}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      value={itemPrice}
                      onChange={(e) => setItemPrice(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Price"
                      onKeyPress={handleKeyPress}
                    />
                    <button
                      onClick={addItem}
                      className="ml-2 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Items List */}
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-3">Current Items</h3>
              {items.length === 0 ? (
                <p className="text-gray-500">No items added yet</p>
              ) : (
                <ul className="divide-y">
                  {items.map((item, index) => (
                    <li
                      key={index}
                      className="py-2 flex justify-between items-center"
                    >
                      <span className="truncate max-w-[60%]">
                        {item.name} - ${item.price.toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeItem(index)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Receipt Preview */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="text-lg font-medium mb-3">Receipt Preview</h3>
              <div ref={printRef} className="bg-white p-4 rounded">
                <div className="center bold text-lg">{storeName}</div>
                <div className="center text-sm text-gray-500 mb-2">
                  123 Main St, City
                </div>
                <div className="center text-sm text-gray-500">
                  Tel: (123) 456-7890
                </div>
                <div className="divider"></div>
                <div className="text-xs text-gray-500 center">
                  {new Date().toLocaleDateString()}{" "}
                  {new Date().toLocaleTimeString()}
                </div>
                <div className="divider"></div>

                <div className="items">
                  {items.map((item, index) => (
                    <div key={index} className="item-row text-sm mb-1">
                      <span>{item.name}</span>
                      <span>${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="divider"></div>

                <div className="item-row text-sm">
                  <span>Subtotal:</span>
                  <span>${calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="item-row text-sm">
                  <span>Tax ({taxRate}%):</span>
                  <span>${calculateTax().toFixed(2)}</span>
                </div>
                <div className="total-row">
                  <span>TOTAL:</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>

                <div className="divider"></div>
                <div className="thank-you center">
                  Thank you for your purchase!
                </div>
                <div className="center text-xs mt-2">Please come again</div>
              </div>
            </div>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              disabled={items.length === 0}
              className={`w-full py-3 px-4 rounded-md text-white font-medium ${
                items.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } transition duration-200`}
            >
              Print Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
