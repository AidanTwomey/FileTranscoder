const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
const ffmpeg = require('fluent-ffmpeg')

exports.my_first_transcoder = function transcodeMe (req, res) {

  const storage = require('@google-cloud/storage')();

  console.log("transcoding " + req.body.fileroot);

  console.log("setting path");

  ffmpeg.setFfmpegPath(ffmpegPath);

  var input = storage.bucket(req.body.inputbucket).file(req.body.fileroot + '.flac');
  var outBucket = storage.bucket(req.body.outputbucket);

  console.log("read input file from bucket");

  var remoteWriteStream = outBucket.file(req.body.fileroot + '.mp3').createWriteStream();

  console.log("created write stream");

  input.exists(function(err, exists) { console.log(req.body.fileroot + " exists") })

  var command = new ffmpeg( input.createReadStream() )
      .audioBitrate(128)
      .format('mp3')
      .on('error', function(err, stdout, stderr) {
        res.send('Cannot process audio: ' + err.message);
      })
      .on('end', function(){
        res.send('finished');
      })
      .output(remoteWriteStream)
      .run()
}
