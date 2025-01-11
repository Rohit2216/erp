const express = require('express');
const { verifyDealerToken } = require('./helpers/verifyToken');

const {getProfileDetails, updateProfile, changePassword} = require('./controllers/superAdminController');
const { createTutorial, getTutorials, updateTutorials, deleteTutorialsById, getTutorialByFormat } = require('./controllers/tutorialController');
const { getAllModule } = require('./controllers/moduleController');
const { getAllRolesForDropdown } = require('./controllers/roleController');
const { getApprovedComplaintsDetailsById, getAllApprovedComplaints, getAllRequestedComplaints } = require('./controllers/contractorComplaintController');
const { uploadComplaintImages, getAllUploadedImages, getSingleUploadedImagesById, updateComplaintImages, deleteComplaintWorkImages, getComplaintImagesForPPT } = require('./controllers/complaintImagesController');
const { getNotifications, getLoggedUserNotifications, countLoggedUserUnreadNotifications, markAsReadNotifications } = require('./controllers/notificationController');

const dealerRouter = express.Router();

dealerRouter.post('/dealer/profile-update', verifyDealerToken, updateProfile);
dealerRouter.get('/dealer/profile', verifyDealerToken, getProfileDetails);
dealerRouter.post('/dealer/change-password', verifyDealerToken, changePassword);


//----------------------------Module routes----------------------------
dealerRouter.get('/dealer/get-all-module', verifyDealerToken, getAllModule);                         

//----------------------------Roles For Dropdown routes----------------------------
dealerRouter.get('/dealer/get-all-roles-for-dropdown', verifyDealerToken, getAllRolesForDropdown);

//----------------------------Tutorials routes----------------------------
dealerRouter.post('/dealer/create-tutorial', verifyDealerToken, createTutorial);
dealerRouter.get('/dealer/get-all-tutorials', verifyDealerToken, getTutorials);
dealerRouter.get('/dealer/get-single-tutorial-details/:format', verifyDealerToken, getTutorialByFormat);

dealerRouter.post('/dealer/update-tutorial-details', verifyDealerToken, updateTutorials);
dealerRouter.delete('/dealer/delete-tutorial/:id', verifyDealerToken, deleteTutorialsById);

// --------- complaint modules --------------------
dealerRouter.get('/dealer/get-approved-complaints-details/:id', verifyDealerToken, getApprovedComplaintsDetailsById)
dealerRouter.get('/dealer/get-approved-complaints', verifyDealerToken, getAllApprovedComplaints);

// --------- complaint modules --------------------
dealerRouter.get('/dealer/get-all-notifications', verifyDealerToken, getNotifications)
dealerRouter.get('/dealer/get-logged-user-notifications', verifyDealerToken, getLoggedUserNotifications)
dealerRouter.get('/dealer/count-logged-user-unread-notifications', verifyDealerToken, countLoggedUserUnreadNotifications)
dealerRouter.post('/dealer/mark-as-read-notifications', verifyDealerToken, markAsReadNotifications)


//-------------------------Upload complaint images routes-------------------------

dealerRouter.post('/dealer/upload-complaint-images', verifyDealerToken, uploadComplaintImages);
dealerRouter.get('/dealer/get-all-uploaded-complaint-images', verifyDealerToken, getAllUploadedImages);
dealerRouter.get('/dealer/get-single-uploaded-complaint-images/:id', verifyDealerToken, getSingleUploadedImagesById);
dealerRouter.post('/dealer/update-uploaded-complaint-images', verifyDealerToken, updateComplaintImages);
dealerRouter.delete('/dealer/delete-uploaded-complaint-images/:id', verifyDealerToken, deleteComplaintWorkImages);
dealerRouter.get('/dealer/domplaint-images-prepare-ppt/:id', verifyDealerToken, getComplaintImagesForPPT);
dealerRouter.get('/dealer/get-requested-complaints', verifyDealerToken, getAllRequestedComplaints);


module.exports = dealerRouter;