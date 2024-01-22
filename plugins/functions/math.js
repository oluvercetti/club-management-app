export default ({ app }, inject) => {
    const randomAlphaNumeric = (length) => {
      let s = '';
      Array.from({ length }).some(() => {
        s += Math.random().toString(36).slice(2);
        return s.length >= length;
      });
      return s.slice(0, length);
    };
  
    inject('random_alpha_numeric', randomAlphaNumeric);
  };
  