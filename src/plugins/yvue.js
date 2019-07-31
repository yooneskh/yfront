import Vue from 'vue';
import moment from 'moment-jalaali';

moment.loadPersian({ dialect: 'persian-modern' });

function formatTime(time, format) {
    return moment(time || undefined).format(format)
}

function truncate(lengthy, truncateLength) {

    if (!lengthy || !lengthy.length || lengthy.length <= truncateLength) return lengthy;

    return lengthy.slice(0, truncateLength) + ' ...';

}


Vue.filter('truncate', truncate);
Vue.filter('formatTime', formatTime);

Vue.mixin({
    methods: {
        $formatTime(time, format) {
            return formatTime(time, format);
        },
        $truncate(lengthy, truncateLength) {
            return truncate(lengthy, truncateLength);
        }
    }
});
