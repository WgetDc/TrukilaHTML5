var width = window.innerWidth;
    var height = window.innerHeight;

    var stage = new Konva.Stage({
      container: 'container',
      width: 1245,
      height: height,
    });
    var layer = new Konva.Layer();
    stage.add(layer);

    // what is url of dragging element?
    var itemURL = '';
    document
      .getElementById('drag-items')
      .addEventListener('dragstart', function (e) {
        itemURL = e.target.src;
      });

    var con = stage.container();
    con.addEventListener('dragover', function (e) {
      e.preventDefault(); // !important
    });

    con.addEventListener('drop', function (e) {
      e.preventDefault();
      // now we need to find pointer position
      // we can't use stage.getPointerPosition() here, because that event
      // is not registered by Konva.Stage
      // we can register it manually:
      stage.setPointersPositions(e);

      Konva.Image.fromURL(itemURL, function (image) {
        layer.add(image);

        image.position(stage.getPointerPosition());
        image.draggable(true);

        layer.draw();
      });
    });

    document.getElementById("download").addEventListener("click", function() {

        html2canvas(document.querySelector('#container')).then(function(canvas) {
        
            console.log(canvas);
            saveAs(canvas.toDataURL(), 'file-name.png');
        });
        });
        
        
        function saveAs(uri, filename) {
        
        var link = document.createElement('a');
        
        if (typeof link.download === 'string') {
        
            link.href = uri;
            link.download = filename;
        
            //Firefox requires the link to be in the body
            document.body.appendChild(link);
        
            //simulate click
            link.click();
        
            //remove the link when done
            document.body.removeChild(link);
        
        } else {
        
            window.open(uri);
        
        }
        }



        //Guardar a PDF
        document.getElementById('save').addEventListener('click', function () {
          var pdf = new jsPDF('l', 'px', [stage.width(), stage.height()]);
          pdf.setTextColor('#000000');
          // first add texts
          stage.find('Text').forEach((text) => {
            const size = text.fontSize() / 0.75; // convert pixels to points
            pdf.setFontSize(size);
            pdf.text(text.text(), text.x(), text.y(), {
              baseline: 'top',
              angle: -text.getAbsoluteRotation(),
            });
          });
  
          // then put image on top of texts (so texts are not visible)
          pdf.addImage(
            stage.toDataURL({ pixelRatio: 2 }),
            0,
            0,
            stage.width(),
            stage.height()
          );
  
          pdf.save('canvas.pdf');
        });


       //undoo
