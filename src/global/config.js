export const Config = {
  auth: {
    registerEnabled: true,
    isAuthMandatory: false,
    refreshIdentityOnLoad: true
  },
  baseLayout: {
    defaultBarMode: 'sidebar', // appbar | sidebar
    appBarHeight: 64,
    barColor: 'primary',
    isBarColorDark: true,
    isAppBarSticky: true,
    mainContentAreaTopSpacing: 12,
    appBarToolbarHeight: 44,
    appBarToolbarScrollbarHeight: 15
  },
  socket: {
    enabled: false,
    needsAuthentication: true
  },
  localization: {
    default: 'fa'
  }
}