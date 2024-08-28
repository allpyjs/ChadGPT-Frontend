// NavigationService.js

let navigateReference = null;

// Function to set the reference
export const setNavigate = (navigateFunction) => {
  navigateReference = navigateFunction;
};

// Navigate function to be used outside of components
export const navigateTo = (path, options = {}) => {
  if (navigateReference) {
    navigateReference(path, options);
  } else {
    console.error("Navigate function has not been set yet.");
  }
};
