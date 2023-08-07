/**
 *  Set Home URL based on User Roles
 */
const getHomeRoute = role => {
  if (role === 'client') return '/acl'
  else if (role == 'admin') return '/apps/user/panel'
  else return '/dashboards/analytics'
}

export default getHomeRoute
