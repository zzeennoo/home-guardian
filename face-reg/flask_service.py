# This is a _very simple_ example of a web service that recognizes faces in uploaded images.
# Upload an image file and it will check if the image contains a picture of Barack Obama.
# The result is returned as json. For example:
#
# $ curl -XPOST -F "file=@obama2.jpg" http://127.0.0.1:5001
#
# Returns:
#
# {
#  "face_found_in_image": true,
#  "is_picture_of_obama": true
# }
#
# This example is based on the Flask file upload example: http://flask.pocoo.org/docs/0.12/patterns/fileuploads/

# NOTE: This example requires flask to be installed! You can install it with pip:
# $ pip3 install flask

import face_recognition
from flask import Flask, jsonify, request, redirect
from flask_cors import CORS
import numpy as np

# You can change this to any folder on your system
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

app = Flask(__name__)
CORS(app)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
           
@app.errorhandler(404)
def page_not_found(e):
    return jsonify({"error": "404 Not Found"}), 404

@app.errorhandler(400)
def bad_request(e):
    return jsonify({"error": "400 Bad Request"}), 400
def remove_double_backslash(string):
    return string.replace("\\", "")

def normalize_newline(string):
    return string.replace("\r\n", "\n")

@app.route('/verify', methods=['POST'])
def compare():
    """ compare between the received image and the encoded array that is stored in the database
    Args:
        img: an image file or an blob image
        encoding_array: an array of face encoding stored in latin1

    Returns:
        _type_: _description_
    """
    # if 'img' not in request.files:
    #     return bad_request(request)
    
    img = request.files['img']
    if img.filename == '':
        return bad_request(request)
    
    face_unknown = face_recognition.load_image_file(img)
    face_unknown_encoding = face_recognition.face_encodings(face_unknown)
    
    if len(face_unknown_encoding) == 0:
        return jsonify({"error": "No face found in the image"})
    
    
    # i = request.form.get('encoding_array')
    # face_known_encoding = i.encode('latin1').decode('unicode_escape').encode('latin1')
    # face_known_encoding = i.encode()
    # face_known_encoding = i[2:-1].encode().decode('unicode_escape').encode('latin1')
    # face_known_encoding_restore = np.frombuffer(face_known_encoding, dtype=np.float64)
    # match_results = face_recognition.compare_faces([face_unknown_encoding], face_known_encoding_restore)
    for i in request.form.getlist('encoding_array'):
        if (len(i) < 3):
            return bad_request(request)
        face_known_encoding = i[2:-1].encode().decode('unicode_escape').encode('latin1')
        face_known_encoding_restore = np.frombuffer(face_known_encoding, dtype=np.float64)
        match_results = face_recognition.compare_faces(face_unknown_encoding, face_known_encoding_restore)
        if match_results[0]:
            return jsonify({"is_match": True})
        
    if match_results[0]:
        return jsonify({"is_match": True})
    
    return jsonify({"is_match": False})


@app.route('/img2encoding', methods=['POST'])
def img2encoding():
    """ Convert image to face encoding
    Args:
        img: an image file or an blob image

    Returns:
        face_encoding: a binary object of face encoding decoded in latin1
    """
    if 'img' not in request.files:
        return bad_request(request)
    
    img = request.files['img']
    if img.filename == '':
        return bad_request(request)
    
    if img:
        return convertImg2Bin(img)
    
def convertImg2Bin(file_stream):
    img = face_recognition.load_image_file(file_stream)
    face_encoding = face_recognition.face_encodings(img)
    
    if len(face_encoding) == 0:
        return jsonify({"error": "No face found in the image"})
    binObj = face_encoding[0].tobytes()
    with open('binObj.txt', 'w') as file:
        file.write(str(binObj))
    
    # return jsonify({"face_encoding": str(binObj)})
    return jsonify({"face_encoding": str(binObj)})
    # return binObj
    

@app.route('/', methods=['GET', 'POST'])
def upload_image():
    # Check if a valid image file was uploaded
    if request.method == 'POST':
        if 'file' not in request.files:
            # return redirect(request.url)
            return bad_request(request)

        file = request.files['file']

        if file.filename == '':
            # return redirect(request.url)
            return bad_request(request)

        # if file and allowed_file(file.filename):
        if file :
            # The image file seems valid! Detect faces and return the result.
            return detect_faces_in_image(file)

    # If no valid image file was uploaded, show the file upload form:
    return '''
    <!doctype html>
    <title>Is this a picture of Obama?</title>
    <h1>Upload a picture and see if it's a picture of Obama!</h1>
    <form method="POST" enctype="multipart/form-data" action="/img2encoding">
      <input type="file" name="file">
      <input type="submit" value="Upload">
    </form>
    '''


def detect_faces_in_image(file_stream):
    # Pre-calculated face encoding of Obama generated with face_recognition.face_encodings(img)
    # known_face_encoding = [-0.09634063,  0.12095481, -0.00436332, -0.07643753,  0.0080383,
    #                         0.01902981, -0.07184699, -0.09383309,  0.18518871, -0.09588896,
    #                         0.23951106,  0.0986533 , -0.22114635, -0.1363683 ,  0.04405268,
    #                         0.11574756, -0.19899382, -0.09597053, -0.11969153, -0.12277931,
    #                         0.03416885, -0.00267565,  0.09203379,  0.04713435, -0.12731361,
    #                        -0.35371891, -0.0503444 , -0.17841317, -0.00310897, -0.09844551,
    #                        -0.06910533, -0.00503746, -0.18466514, -0.09851682,  0.02903969,
    #                        -0.02174894,  0.02261871,  0.0032102 ,  0.20312519,  0.02999607,
    #                        -0.11646006,  0.09432904,  0.02774341,  0.22102901,  0.26725179,
    #                         0.06896867, -0.00490024, -0.09441824,  0.11115381, -0.22592428,
    #                         0.06230862,  0.16559327,  0.06232892,  0.03458837,  0.09459756,
    #                        -0.18777156,  0.00654241,  0.08582542, -0.13578284,  0.0150229 ,
    #                         0.00670836, -0.08195844, -0.04346499,  0.03347827,  0.20310158,
    #                         0.09987706, -0.12370517, -0.06683611,  0.12704916, -0.02160804,
    #                         0.00984683,  0.00766284, -0.18980607, -0.19641446, -0.22800779,
    #                         0.09010898,  0.39178532,  0.18818057, -0.20875394,  0.03097027,
    #                        -0.21300618,  0.02532415,  0.07938635,  0.01000703, -0.07719778,
    #                        -0.12651891, -0.04318593,  0.06219772,  0.09163868,  0.05039065,
    #                        -0.04922386,  0.21839413, -0.02394437,  0.06173781,  0.0292527 ,
    #                         0.06160797, -0.15553983, -0.02440624, -0.17509389, -0.0630486 ,
    #                         0.01428208, -0.03637431,  0.03971229,  0.13983178, -0.23006812,
    #                         0.04999552,  0.0108454 , -0.03970895,  0.02501768,  0.08157793,
    #                        -0.03224047, -0.04502571,  0.0556995 , -0.24374914,  0.25514284,
    #                         0.24795187,  0.04060191,  0.17597422,  0.07966681,  0.01920104,
    #                        -0.01194376, -0.02300822, -0.17204897, -0.0596558 ,  0.05307484,
    #                         0.07417042,  0.07126575,  0.00209804]
    picture_of_me = face_recognition.load_image_file("me.jpg")
    known_face_encoding = face_recognition.face_encodings(picture_of_me)[0]
    # Load the uploaded image file
    img = face_recognition.load_image_file(file_stream)
    # Get face encodings for any faces in the uploaded image
    unknown_face_encodings = face_recognition.face_encodings(img)

    face_found = False
    is_viettung = False

    if len(unknown_face_encodings) > 0:
        face_found = True
        # See if the first face in the uploaded image matches the known face of Obama
        match_results = face_recognition.compare_faces([known_face_encoding], unknown_face_encodings[0])
        if match_results[0]:
            is_viettung = True

    # Return the result as json
    result = {
        "face_found_in_image": face_found,
        "is_picture_of_viettung": is_viettung
    }
    return jsonify(result)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5200, debug=True)