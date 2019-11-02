import { configure, shallow, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

//Enzyme obligatory configuration
configure({ adapter: new Adapter() });

// Make functions globally available in all tests
global.shallow = shallow
global.mount = mount