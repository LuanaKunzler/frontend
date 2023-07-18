import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import * as BlankValidators from '../../../../utils/validators/blank.validator';
import { AuthorsService } from 'src/app/services/admin-services/authors.service';
import { CategoriesService } from 'src/app/services/admin-services/categories.service';
import { Author, Book, BookCategory, BookRequest } from 'src/app/store/model';
import { BooksService } from 'src/app/services/admin-services/books.service';
import { catchError, take, throwError } from 'rxjs';
import { SuccessMessage } from 'src/app/common/messages';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.scss'],
})
export class ProductCreateComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  productForm: FormGroup | any;
  product: BookRequest | any;
  previewImageUrl: string | ArrayBuffer | null = null;
  dimensionsErrorMessage: boolean = false;
  sizeErrorMessage: boolean = false;
  innerLoading = true;
  pageSize = 10;
  pageIndex = 0;
  authors: Author[] = [];
  categories: BookCategory[] = [];

  constructor(
    private bookService: BooksService,
    private authorService: AuthorsService,
    private categoryService: CategoriesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productForm = new FormGroup({
      image: new FormControl(null, [Validators.required]),
      title: new FormControl(null, [
        BlankValidators.checkIfBlankValidator,
        Validators.required,
      ]),
      description: new FormControl(null, [
        BlankValidators.checkIfBlankValidator,
        Validators.required,
      ]),
      author: new FormControl(null, [Validators.required]),
      category: new FormControl(null, [Validators.required]),
      isbn: new FormControl(null, [
        BlankValidators.checkIfBlankValidator,
        Validators.required,
      ]),
      bookEdition: new FormControl(null, [
        BlankValidators.checkIfBlankValidator,
        Validators.required,
      ]),
      language: new FormControl(null, [
        BlankValidators.checkIfBlankValidator,
        Validators.required,
      ]),
      numberOfPages: new FormControl(null, [
        BlankValidators.checkIfBlankValidator,
      ]),
      unitsInStock: new FormControl(null, [Validators.required]),
      unitPrice: new FormControl(null, [Validators.required]),
      isActive: new FormControl(null, [Validators.required]),
    });

    this.getAuthors();
    this.getCategories();

    this.innerLoading = false;
  }

  getAuthors(): void {
    const sortDirection = 'asc';
    const sortField = 'name';

    this.authorService
      .getAuthors(this.pageIndex, this.pageSize, sortDirection, sortField)
      .subscribe((authors) => {
        this.authors = authors.content;
      });
  }

  getCategories(): void {
    const sortDirection = 'asc';
    const sortField = 'name';

    this.categoryService
      .getCategories(this.pageIndex, this.pageSize, sortDirection, sortField)
      .subscribe((categories) => {
        this.categories = categories.content;
      });
  }

  onSubmit() {
    this.innerLoading = true;
    console.log(this.authors);
    

    const authorId = this.productForm.value.author;
    const selectedAuthor = this.authors.find((author) => author.id.toString() === authorId.toString());
    const authorName = selectedAuthor ? selectedAuthor.name : '';

    const categoryId = this.productForm.value.category;
    const selectedCategory = this.categories.find((category) => category.id.toString() === categoryId.toString());
    const categoryName = selectedCategory ? selectedCategory.name : '';

    const bookUrl =
      this.productForm.value.isbn +
      '_' +
      this.replaceSpacesWithUnderscores(this.productForm.value.title);

    const imageUrl = this.productForm.value.image;

    const bookRequest: BookRequest = {
      title: this.productForm.value.title,
      longDesc: this.productForm.value.description,
      bookCategory: { id: categoryId, name: categoryName },
      author: { id: authorId, name: authorName },
      isbn: this.productForm.value.isbn,
      bookEdition: this.productForm.value.bookEdition,
      numberOfPages: this.productForm.value.numberOfPages,
      language: this.productForm.value.language,
      bookUrl: bookUrl,
      unitPrice: this.productForm.value.unitPrice,
      unitsInStock: this.productForm.value.unitsInStock,
      isActive: this.productForm.value.isActive,
    };

    this.bookService
      .createBook(imageUrl, bookRequest)
      .pipe(
        take(1),
        catchError((error) => {
          return throwError(() => new Error(error));
        })
      )
      .subscribe(() => {
        this.innerLoading = false;
        this.snackBarToast();
        this.router.navigate(['/admin/products']);
      });
  }

  replaceSpacesWithUnderscores(text: string): string {
    return text.toLowerCase().replace(/\s/g, '_');
  }

  snackBarToast() {
    this.bookService.snackBarToast(SuccessMessage.PRODUCT_CREATED);
  }

  onFileChange(event: any) {
    const file = event.target.files[0];

    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      this.sizeErrorMessage = true;
      return;
    }

    this.productForm.patchValue({
      image: file,
    });

    this.productForm.get('image').updateValueAndValidity();

    // Ler a imagem como um objeto FileReader
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const maxWidth = 600;
        const maxHeight = 600;

        if (image.width > maxWidth || image.height > maxHeight) {
          this.dimensionsErrorMessage = true;
          return;
        }

        this.previewImageUrl = reader.result;
      };
      image.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  clearImage() {
    this.productForm.patchValue({
      image: null,
    });
    this.productForm.get('image').updateValueAndValidity();
    this.previewImageUrl = null;
  }

  clearFileInput() {
    this.productForm.get('image').setValue(null);
    this.dimensionsErrorMessage = false;
    this.sizeErrorMessage = false;
    this.fileInput.nativeElement.value = '';
    this.previewImageUrl = null;
  }

  cancel() {
    this.router.navigate(['/admin/products']);
  }
}
