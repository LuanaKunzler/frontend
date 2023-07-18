import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BooksService } from 'src/app/services/admin-services/books.service';
import { Author, BookCategory, BookRequest, User } from 'src/app/store/model';
import * as BlankValidators from '../../../../utils/validators/blank.validator';
import { AuthorsService } from 'src/app/services/admin-services/authors.service';
import { CategoriesService } from 'src/app/services/admin-services/categories.service';
import { catchError, take, throwError } from 'rxjs';
import { SuccessMessage } from 'src/app/common/messages';

@Component({
  selector: 'app-product-update',
  templateUrl: './product-update.component.html',
  styleUrls: ['./product-update.component.scss'],
})
export class ProductUpdateComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  updateProductForm: FormGroup;
  book: User | any;
  bookId: number | undefined;
  innerLoading = true;
  dimensionsErrorMessage: boolean = false;
  sizeErrorMessage: boolean = false;
  previewImageUrl: string | ArrayBuffer | null = null;
  authors: Author[] = [];
  categories: BookCategory[] = [];
  pageSize = 10;
  pageIndex = 0;

  constructor(
    private service: BooksService,
    private authorService: AuthorsService,
    private categoriesService: CategoriesService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.updateProductForm = new FormGroup({
      image: new FormControl(null, []),
      title: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      author: new FormControl(null, [Validators.required]),
      category: new FormControl(null, [Validators.required]),
      isbn: new FormControl(null, [Validators.required]),
      bookEdition: new FormControl(null, [Validators.required]),
      language: new FormControl(null, [Validators.required]),
      numberOfPages: new FormControl(null, []),
      unitsInStock: new FormControl(null, [Validators.required]),
      unitPrice: new FormControl(null, [Validators.required]),
      isActive: new FormControl(null),
    });
  }

  ngOnInit(): void {
    this.bookId = Number(this.route.snapshot.paramMap.get('id'));

    this.service.getBookById(this.bookId).subscribe((book) => {
      this.book = book;

      this.updateProductForm.patchValue({
        image: book.imageUrl,
        title: book.title,
        description: book.longDesc,
        isbn: book.isbn,
        bookEdition: book.bookEdition,
        author: book.bookAuthor?.id,
        category: book.bookCategory?.id,
        language: book.language,
        numberOfPages: book.numberOfPages,
        unitsInStock: book.unitsInStock,
        unitPrice: book.unitPrice,
        isActive: book.isActive ? 'true' : 'false',
      });
      this.previewImageUrl = book.imageUrl;
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

    this.categoriesService
      .getCategories(this.pageIndex, this.pageSize, sortDirection, sortField)
      .subscribe((categories) => {
        this.categories = categories.content;
      });
  }

  onUpdate() {
    this.innerLoading = true;

    const authorId = this.updateProductForm.value.author;
    const selectedAuthor = this.authors.find(
      (author) => author.id.toString() === authorId.toString()
    );
    const authorName = selectedAuthor ? selectedAuthor.name : '';

    const categoryId = this.updateProductForm.value.category;
    const selectedCategory = this.categories.find(
      (category) => category.id.toString() === categoryId.toString()
    );
    const categoryName = selectedCategory ? selectedCategory.name : '';

    const bookUrl =
      this.updateProductForm.value.isbn +
      '_' +
      this.replaceSpacesWithUnderscores(this.updateProductForm.value.title);

    const imageUrl = this.updateProductForm.value.image;

    let file: File | null = null;
    if (typeof imageUrl === 'object') {
      // imageUrl é um objeto File, não é necessário fazer a conversão
      file = imageUrl;
    } else if (
      typeof imageUrl === 'string' &&
      imageUrl.startsWith('data:image')
    ) {
      const byteString = atob(imageUrl.split(',')[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: 'image/jpeg' });

      const fileName = this.updateProductForm.value.isbn + '.jpg';
      file = new File([blob], fileName, { type: 'image/jpeg' });
    }

    if (!file) {
      console.log('Algo deu errado');
      return;
    }

    const bookRequest: BookRequest = {
      title: this.updateProductForm.value.title,
      longDesc: this.updateProductForm.value.description,
      bookCategory: { id: categoryId, name: categoryName },
      author: { id: authorId, name: authorName },
      isbn: this.updateProductForm.value.isbn,
      bookEdition: this.updateProductForm.value.bookEdition,
      numberOfPages: this.updateProductForm.value.numberOfPages,
      language: this.updateProductForm.value.language,
      bookUrl: bookUrl,
      unitPrice: this.updateProductForm.value.unitPrice,
      unitsInStock: this.updateProductForm.value.unitsInStock,
      isActive: this.updateProductForm.value.isActive,
    };

    this.service
      .updateBook(this.bookId, file, bookRequest)
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
    this.service.snackBarToast(SuccessMessage.PRODUCT_UPDATED);
  }

  onFileChange(event: any) {
    const file = event.target.files[0];

    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      this.sizeErrorMessage = true;
      return;
    }

    this.updateProductForm.patchValue({
      image: file,
    });

    this.updateProductForm.get('image')!.updateValueAndValidity();

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

        this.previewImageUrl = reader.result as string;
      };
      image.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  clearImage() {
    this.updateProductForm.patchValue({
      image: null,
    });
    this.updateProductForm!.get('image')!.updateValueAndValidity();
    this.previewImageUrl = null;
  }

  clearFileInput() {
    this.updateProductForm!.get('image')!.setValue(null);
    this.dimensionsErrorMessage = false;
    this.sizeErrorMessage = false;
    this.fileInput.nativeElement.value = '';
    this.previewImageUrl = null;
  }

  cancel() {
    this.router.navigate(['/admin/products']);
  }
}
