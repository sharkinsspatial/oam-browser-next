const routes = {
  '/': {
    title: 'home',
    '/uploads': {
      title: 'uploads'
    },
    '/imageitems/:imageId': {
      title: 'imageitemdetails'
    }
  }
};

export const restrictedRoutes = ['/uploads'];
export default routes;
