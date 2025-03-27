import { createSelector } from 'reselect';
const authSelect = (state) => state.auth;

export const selectAuth = (state) => {
  return state.auth;
};
// export const selectAuth = (state) => true;

export const selectCurrentAdmin = createSelector([selectAuth], (auth) => auth.current);

export const isLoggedIn = createSelector([selectAuth], (auth) => auth.isLoggedIn);
// export const isLoggedIn = true;
