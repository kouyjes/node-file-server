import LoadEnvironment from './main/environment';
import main from './main/index';
LoadEnvironment('env/applications.json').then(function (data) {
    main(data);
});