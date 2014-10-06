var patternStorage = {
  
  save: function() {
    localStorage.setItem('drumaticPatterns', JSON.stringify(patterns));

  },

  load: function() {
    var retreivedPatterns = localStorage.getItem('drumaticPatterns', JSON.stringify(patterns));
    if (patterns) {
      return JSON.parse(retreivedPatterns);
    } else {
      return null;
    }
  }
};

patterns = patternStorage.load() ? patternStorage.load() : patterns;