export function configure(config) {
  config.globalResources([
    PLATFORM.moduleName('./elements/sProgressCustomElement'),
    PLATFORM.moduleName('./dash/dashboard'),
    PLATFORM.moduleName('./dash/dashClient'),
    PLATFORM.moduleName('./dash/dashControls'),
    PLATFORM.moduleName('./dash/dashDetails'),
    PLATFORM.moduleName('./dash/dashStreamDetails'),
    PLATFORM.moduleName('./dash/dashPlaylist'),
    PLATFORM.moduleName('./dash/dashSearch'),
    PLATFORM.moduleName('./dash/dashSong'),
    PLATFORM.moduleName('./dash/dashTracklist'),
    PLATFORM.moduleName('./dash/dashVolume'),
    PLATFORM.moduleName('./modals/addClientModal'),
    PLATFORM.moduleName('./attributes/popupCustomAttribute'),
    PLATFORM.moduleName('./nav/nav')
  ]);
}
