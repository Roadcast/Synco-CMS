import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../toast.service';
import jsPDF from 'jspdf';
import { ControlContainer, NgForm } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class FileuploadComponent implements OnInit {

  @Input() url: string='';
  @Input() emptyFile: string='';
  @Input() type: string='';
  @Input() mandatory: boolean = false;
  @Output() getUrl: EventEmitter<string> = new EventEmitter();
  image: any;
  loader: boolean = false;
  fileName: any;
  constructor(
      private translate: TranslateService,
      private storage: AngularFireStorage,
      private toaster: ToastService,
      private cd: ChangeDetectorRef
  ) {}
  ngOnInit() {}
  ngAfterViewInit(): void {}
  ngOnChanges(changes: SimpleChanges) {
      for (const prop in changes) {
          if (prop === 'mandatory') {
              this.mandatory = changes[prop].currentValue;
          }
          if (prop === 'emptyFile') {
              if (changes[prop].currentValue === '') {
                  this.fileName = '';
              }
          }
      }
      this.cd.detectChanges();
  }
  create_UUID() {
      let dt = new Date().getTime();
      return 'xxxyxyxxyxxx'.replace(/[xy]/g, (c) => {
          const r = (dt + Math.random() * 16) % 16 | 0;
          dt = Math.floor(dt / 16);
          return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
  }
  translateText(key: string): string {
      let translation: string='';
      this.translate.get(key).subscribe((res: string) => {
          translation = res;
      });
      return translation;
  }
  getBase64(file:any) {
      return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
      });
  }
  async uploadFile(event:any) {
      const inputFiles = event.target.files;
  const maxFileSizeKB = 100;
  const fileSize = inputFiles[0].size / 1024;
  if (fileSize > maxFileSizeKB) {
  }
  this.fileName = event.target.files[0].name;
  const doc = new jsPDF();
  let file: File;
  if (inputFiles.length > 1) {
    for (let i = 0; i < inputFiles.length; i++) {
      const compressedFile = await this.compressImage(inputFiles[i]);
      this.getBase64(inputFiles[i]).then(
        (imageData: any ) => {
          doc.addImage(imageData, 'JPG', 10, (i * 120) + 10, 180, 100);
          const blob = new Blob([doc.output('blob')], {type: 'pdf'});
          file = new File([blob], 'test.pdf');
          this.fileUrlGenerate(compressedFile);
    });
    }
  } else {
    file = inputFiles[0];
    const compressedFile = await this.compressImage(file);
    this.fileUrlGenerate(compressedFile);
  }
  }
async compressImage(file: File): Promise<File> {
  return new Promise(async (resolve) => {
    const fileSizeMB = file.size / (1024 * 1024); 
    const compressionThresholdMB = 1; 

    if (fileSizeMB > compressionThresholdMB) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event:any) => {
        const img = new Image();
        img.src = event.target.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const maxWidth = 500;
          const maxHeight = 1000;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx!.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob:any) => {
            const compressedFile = new File([blob], file.name, { type: 'image/jpeg' });
            resolve(compressedFile);
          }, 'image/jpeg', 1.0);
        };
      };
    } else {
      
      resolve(file);
    }
  });
}
  fileUrlGenerate(file:any) {
      const re = '.' + file.name.split('.').pop().toString();
      let filePath = this.create_UUID();
      filePath = filePath.concat(re);
      this.loader = true;
      if (this.validateFile(filePath)) {
          const ref = this.storage.ref(filePath);
          const task = ref.put(file);
          task.then(() => {
              this.url =
                  'https://firebasestorage.googleapis.com/v0/b/synco-dc96f.appspot.com/o/' +
                  filePath +
                  '?alt=media';
              this.getUrl.emit(this.url);
              console.log(file)
              this.loader = false;
          });
      } else {
          this.toaster.showToast(
              this.translateText(
                  'Not a valid file for upload. (Only png, jpg, jpeg and pdf allowed)'
              ),
              'Error',
              true
          );
          this.loader = false;
      }
  }
  validateFile(name: String) {
      const ext = name.substring(name.lastIndexOf('.') + 1);
      if (
          ext.toLowerCase() === 'png' ||
          ext.toLowerCase() === 'jpg' ||
          ext.toLowerCase() === 'jpeg' ||
          ext.toLowerCase() === 'pdf'
      ) {
          return true;
      } else {
          return false;
      }
  }
}
