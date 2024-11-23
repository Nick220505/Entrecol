import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PdfViewerComponent } from './pdf-viewer.component';

describe('PdfViewerComponent', () => {
  let component: PdfViewerComponent;
  let fixture: ComponentFixture<PdfViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdfViewerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PdfViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default height', () => {
    expect(component.height()).toBe('80vh');
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

  it('should pass src input to PDF viewer', () => {
    const testSrc = 'test-src';
    @Component({
    template: '<app-pdf-viewer [src]="testSrc" />',
    imports: [PdfViewerComponent]
})
    class TestComponent {
      testSrc = testSrc;
    }

    const testFixture = TestBed.createComponent(TestComponent);
    testFixture.detectChanges();

    const pdfViewer = testFixture.nativeElement.querySelector(
      'ngx-extended-pdf-viewer',
    );
    expect(pdfViewer.getAttribute('ng-reflect-src')).toBe(testSrc);
  });
});
