import { L } from '@angular/cdk/keycodes';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { WelcomeScreenService } from 'src/app/services/welcome-screen.service';
declare var $: any;
@Component({
  selector: 'app-welcome-screen',
  templateUrl: './welcome-screen.component.html',
  styleUrls: ['./welcome-screen.component.css']
})
export class WelcomeScreenComponent implements OnInit {
  isActiveProject: boolean = true;
  isProject: boolean = true;
  imageForm: FormGroup;
  colorPickerModal: boolean = false;
  chooseColor: boolean = false;
  show = false;
  spinner: boolean = true;
  text = "VISITOR IN"
  isDisabled = false;
  disabled = false
  imageSelected: any = '../../../../assets/images/breazie.png'
  WelcomeScreenForm: FormGroup

  constructor(
    private fb: FormBuilder,
    private welcomeScree: WelcomeScreenService,
    private toastr: ToastrService,private router:Router) {

    this.WelcomeScreenForm = fb.group({
      selected: [' '],
      deviceOrientation: [' '],
      frameColor: [' '],
      visitorIn: [' '],
      visitorInTextColor: [' '],
      visitorInBackgroundColor: [' '],
      visitorInBorder: [' '],
    })
  }

  ngOnInit(): void {
    //
    this.getWelcomScreens()
    this.getImage()
    this.swipe();
  }

  color = "#0000"
  colorChange(color) {
    document.getElementById('visitorins').style.backgroundColor = this.color;
    this.WelcomeScreenForm.get('visitorInBackgroundColor').setValue(this.color)
  }

  selectedFiles ? : FileList;

  urls: any = []
  onselect(event) {
    const file = (event.target as HTMLInputElement).files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.urls.push(reader.result as string)
    };
    reader.readAsDataURL(file);
    this.welcomeScree.addImage(file).subscribe(res => {
      this.getImage()
    }, (err) => {
      this.toastr.error(err.error.message)
    })
  }


  imagesPath: any = []
  trueValue: any = [];
  falseValue: [];
  getImage() {
    this.welcomeScree.getImage().subscribe(res => {
      this.spinner = false
      this.imagesPath = res.response
      this.trueValue = []
      res.response.forEach(ele => {
        if (ele.selected == "true") {
          this.imageSelected = ele.imagePath
        }
        // this.trueValue=[]
        if (ele.hidden === false) {
          this.trueValue.push(ele);
        
          
        }
      })
    },(err) => {
      if (err.status) {
        this.toastr.error(err.error.message);
        this.logOut()
      } else {
        this.toastr.error('CONNECTION_ERROR');
      }
    })
  }
  logOut() {
    this.router.navigate(['/auth/login']);
    localStorage.clear();
  }
  onDelete(id) {
    // if (this.trueValue.lenght>1) {
    this.welcomeScree.deleteImage(id).subscribe(res => {
      this.getImage()
    })
    // }
  }

  activeProject() {
    this.isActiveProject = !this.isActiveProject
  }

  Project() {
    this.isProject = !this.isProject
  }

  selected(id, selected, image) {
    this.imageSelected = image
    this.welcomeScree.selectImage(id, selected).subscribe(res => {
      if (!res.error) {
        this.toastr.success(res.message)
      } else {
        this.toastr.error(res.message)
      }
    })
  }

  selectedColor = {
    name: 'Indigo',
    value: '#3F51B5'
  };
  colors = [{
      name: 'Red',
      value: '#F44336'
    },
    {
      name: 'Pink',
      value: '#E91E63'
    },
    {
      name: 'Purple',
      value: '#9C27B0'
    },
    {
      name: 'Deep Purple',
      value: '#673AB7'
    },
  ];
  color2 = '#753434';
  customPalette = {
    pickerShow: true,
    id: 'custom1',
    noHide: false,

    colors: [
      '#EBF5FA', '#B4E1FA', '#007ACE', '#084E8A', '#001429'
    ]
  };

  colorPickers() {
    this.WelcomeScreenForm.get('visitorInTextColor').setValue(this.selectedColor.value)
    this.colorPickerModal = !this.colorPickerModal;
    this.chooseColor = !this.chooseColor
  }

  showBorder = false;
  showCorner = false;
  showRadius = false;
  corner() {
    this.showBorder = true;
    this.showCorner = false;
    this.showRadius = false;
    this.WelcomeScreenForm.get('visitorInBorder').setValue('corner')
  }
  border() {
    this.showCorner = true;
    this.showBorder = false;
    this.showRadius = false;
    this.WelcomeScreenForm.get('visitorInBorder').setValue('border')
  }
  radius() {
    this.showRadius = true;
    this.showBorder = false;
    this.showCorner = false;
    this.WelcomeScreenForm.get('visitorInBorder').setValue('radius')
  }

  getWelcomScreens() {
    this.welcomeScree.getWelcomScreen().subscribe(res => {
      // this.WelcomeScreenForm.get('visitorIn').setValue(res.settings[0].welcomeScreen.visitorIn)
      // this.selectedColor.value =   res.settings[0].welcomeScreen.visitorInTextColor
      // document.getElementById('visitorins').style.backgroundColor=res.settings[0].welcomeScreen.visitorInBackgroundColor
      // this.WelcomeScreenForm.get('visitorInTextColor').setValue( res.settings[0].welcomeScreen.visitorInTextColor )
      // this.WelcomeScreenForm.get('visitorInBackgroundColor').setValue(res.settings[0].welcomeScreen.visitorInBackgroundColor)
    },(err) => {
      if (err.status) {
        this.toastr.error(err.error.message);
        this.logOut()
      } else {
        this.toastr.error('CONNECTION_ERROR');
      }
    })
  }

  onSubmit() {
    this.spinner = true
    this.welcomeScree.editWelcomeScreen(this.WelcomeScreenForm.value).subscribe(res => {
      if (!res.error) {
        this.spinner = false
        this.toastr.success(res.message)
      } else {
        this.toastr.error(res.message)
      }
    })
  }

  hiddens: false
  view(id, hidden) {
    this.hiddens != this.hiddens
    this.welcomeScree.updateImage(id, hidden).subscribe((res) => {})
  }

  onClick(index: any, id: any, hidden: any) {
    if (this.trueValue.length > 1) {
      this.imagesPath[index].isDisabled = true
      this.imagesPath[index].show = true
      this.welcomeScree.updateImage(id, hidden).subscribe((res) => {
        this.getImage()
      })
    }
  }

  onClicks(index: any, id: any, hidden: any) {
    this.imagesPath[index].isDisabled = false
    this.imagesPath[index].show = false
    this.welcomeScree.updateImage(id, hidden).subscribe((res) => {
      this.getImage()
    })
  }
  swipe() {
    
    var initialMouse = 0;
    var slideMovementTotal = 0;
    var mouseIsDown = false;
    var slider = $('#slider');
    slider.on('mousedown touchstart', function (event) {
      mouseIsDown = true;
      slideMovementTotal = $('#button-background').width() - $(this).width() + 10;
      initialMouse = event.clientX || event.originalEvent.touches[0].pageX;
    });
    $(document.body, '#slider').on('mouseup touchend', function (event) {
      if (!mouseIsDown)
        return;
      mouseIsDown = false;
      var currentMouse = event.clientX || event.changedTouches[0].pageX;
      var relativeMouse = currentMouse - initialMouse;
      if (relativeMouse < slideMovementTotal) {
        $('.slide-text').fadeTo(300, 1);
        slider.animate({
          left: "0px"
        }, 300);
        return;
      }
      slider.addClass('unlocked');
      $('#locker').text('lock_outline');
      setTimeout(function () {
        slider.on('click tap', function (event) {
          if (!slider.hasClass('unlocked'))
            return;
          slider.removeClass('unlocked');
          $('#locker').text('lock_open');
          slider.off('click tap');
        });
      }, 0);
    });

    $(document.body).on('mousemove touchmove', function (event) {
      if (!mouseIsDown)
        return;
      var currentMouse = event.clientX || event.originalEvent.touches[0].pageX;
      var relativeMouse = currentMouse - initialMouse;
      var slidePercent = 1 - (relativeMouse / slideMovementTotal);
      $('.slide-text').fadeTo(0, slidePercent);
      if (relativeMouse <= 0) {
        slider.css({
          'right': '10px'
        });
        return;
      }
      if (relativeMouse >= slideMovementTotal - 20) {
        slider.css({
          'right': '10px'
        });
        return;
      }
      slider.css({
        'left': relativeMouse - 0
      });
    });
  }
}
