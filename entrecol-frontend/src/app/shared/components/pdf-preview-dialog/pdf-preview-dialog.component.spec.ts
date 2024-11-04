import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PdfPreviewDialogComponent } from './pdf-preview-dialog.component';

describe('PdfPreviewDialogComponent', () => {
  let component: PdfPreviewDialogComponent;
  let fixture: ComponentFixture<PdfPreviewDialogComponent>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<PdfPreviewDialogComponent>>;

  beforeEach(async () => {
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [PdfPreviewDialogComponent, NoopAnimationsModule],
      providers: [{ provide: MatDialogRef, useValue: dialogRef }],
    }).compileComponents();

    fixture = TestBed.createComponent(PdfPreviewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty PDF URL', () => {
    expect(component.pdfUrl()).toBe('');
  });

  it('should set PDF URL', () => {
    const testUrl = 'test-url';
    component.pdfUrl.set(testUrl);
    expect(component.pdfUrl()).toBe(testUrl);
  });

  it('should close dialog when close method is called', () => {
    component.close();
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should have correct title in template', () => {
    const titleElement = fixture.nativeElement.querySelector('h2');
    expect(titleElement.textContent).toContain('Vista Previa del PDF');
  });

  it('should have close button in template', () => {
    const closeButton = fixture.nativeElement.querySelector(
      'button[mat-icon-button]',
    );
    expect(closeButton).toBeTruthy();
    expect(closeButton.querySelector('mat-icon').textContent).toContain(
      'close',
    );
  });

  it('should have PDF viewer component', () => {
    const pdfViewer = fixture.nativeElement.querySelector(
      'ngx-extended-pdf-viewer',
    );
    expect(pdfViewer).toBeTruthy();
  });

  it('should configure PDF viewer with correct properties', () => {
    const pdfViewer = fixture.nativeElement.querySelector(
      'ngx-extended-pdf-viewer',
    );
    expect(pdfViewer.getAttribute('ng-reflect-height')).toBe('80vh');
    expect(pdfViewer.getAttribute('ng-reflect-language')).toBe('es');
    expect(pdfViewer.getAttribute('ng-reflect-show-download-button')).toBe(
      'true',
    );
    expect(pdfViewer.getAttribute('ng-reflect-show-print-button')).toBe('true');
    expect(pdfViewer.getAttribute('ng-reflect-show-open-file-button')).toBe(
      'false',
    );
  });
});
