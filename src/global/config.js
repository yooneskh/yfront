export const Config = {
  auth: {
    registerEnabled: true,
    isAuthMandatory: true
  },
  baseLayout: {
    defaultBarMode: 'sidebar', // or 'sidebar'
    appBarHeight: 64,
    barColor: 'primary',
    isBarColorDark: true,
    isAppBarSticky: false,
    expandingSidebarItems: false,
    mainContentAreaTopSpacing: 12,
    appBarToolbarHeight: 64
  },
  socket: {
    enabled: false,
    needsAuthentication: true
  }
}