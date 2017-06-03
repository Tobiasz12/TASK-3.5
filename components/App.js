var GIPHY_PUB_KEY = 'dc6zaTOxFJmzC';
var GIPHY_API_URL = 'http://api.giphy.com';

App = React.createClass({
  getInitialState() {
      return {
          loading: false,
          searchingText: '',
          gif: {}
      };
  },

  handleSearch: function(searchingText) {
    var self = this;
    self.setState({
      loading: true
    });
      self.getGif(searchingText, function(gif) {
        self.setState({
          loading: false,
          gif: gif,
          searchingText: searchingText
        });
      }).bind(this);
  },

gisRequest: function(searchingText) {
    return new Promise(
        function(resolve,reject){
            const url = GIPHY_API_URL + '/v1/gifs/random?api_key=' + GIPHY_PUB_KEY + '&tag=' + searchingText;
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url);
            xhr.onload = function() {
                if (xhr.status === 200) {
                    var data = JSON.parse(xhr.responseText).data;
                    var gif = {
                        url: data.fixed_width_downsampled_url,
                        sourceUrl: data.url
                    };
                    resolve(gif)
                } else {
                    reject(new Error(xhr.statusText)); // Dostaliśmy odpowiedź, ale jest to np 404
                }

            };
            xhr.onerror = function () {
                reject(new Error(`XMLHttpRequest Error: ${this.statusText}`));
            };
            xhr.send();
    });
},

getGif: funciton(searchingText, callback){
    this.gisRequest(searchingText)
    .then(gif => console.log('Contents: ' + gif))
    .catch(error => console.error('Something went wrong', reason));
}

    render: function() {

        var styles = {
            margin: '0 auto',
            textAlign: 'center',
            width: '90%'
        };

        return (
          <div style={styles}>
                <h1>Wyszukiwarka Gifow!</h1>
                <p>Znajdź gifa na <a href='http://giphy.com'>giphy</a>. Naciskaj enter, aby pobrać kolejne gify.</p>
                <Search onSearch={this.handleSearch}/>
                <Gif
                    loading={this.state.loading}
                    url={this.state.gif.url}
                    sourceUrl={this.state.gif.sourceUrl}
                />
          </div>
        );
    }
});
