// const mockAuth = (req, res, next) => {
//     // DEV / Postman testing only
//     req.userId = '64f000000000000000000001'; // fake Mongo ObjectId
//     req.clerkId = 'clerk_test_user_123';
//     req.user = {
//       _id: req.userId,
//       clerkId: req.clerkId,
//       email: 'testuser@gmail.com',
//       credits: 5,
//       isPro: false,
//       role: 'user'
//     };
//     next();
//   };
//   module.exports = mockAuth;


let MOCK_IS_PRO = false;
let MOCK_SUBSCRIPTION_END_DATE = null;

const mockAuth = (req, res, next) => {
  req.userId = '64f000000000000000000001';
  req.clerkId = 'clerk_test_user_123';
  req.user = {
    _id: req.userId,
    clerkId: req.clerkId,
    email: 'testuser@gmail.com',
    credits: 5,
    isPro: MOCK_IS_PRO,
    subscriptionEndDate: MOCK_SUBSCRIPTION_END_DATE,
    role: 'user'
  };
  req.makePro = () => {
    MOCK_IS_PRO = true;
    MOCK_SUBSCRIPTION_END_DATE = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
  };
  next();
};
module.exports = mockAuth;

  