
export default function Landing() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <img src="/Images/smartspendlogo.png" alt="SmartSpend" className="w-56 " />
  
      <p className="text-gray-600 text-center text-lg mb-4">
        Track your spending. Take control of your allowance.
      </p>
      <button
        onClick={() => (window.location.href = '/login')}
        className="mt-6 bg-primary text-white py-2 px-6 rounded-lg"
      >
        Get started
      </button>
    </div>
  );
}
