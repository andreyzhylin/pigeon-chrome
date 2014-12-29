describe('fileService', function () {
	beforeEach(module('pigeon.fileService'));

	beforeEach(inject(function (_$rootScope_, _fileService_) {
        $rootScope = _$rootScope_;
        fileService = _fileService_;
    }));

    beforeEach(function (done) {
        fileService.init();
        $rootScope.$digest();
        done();
    });

    it('should load data from storage', function () {
        expect(fileService.getAll().length).toBeGreaterThan(0);
    });

    it('should allow obtaining file by index', function () {
        expect(fileService.getAll()[0]).toBe(fileService.get(0));
    });

    it('should allow addition of files', function (done) {
        var file = {};
        file.name = 'New file';
        file.code = 'var a = 0;';
        fileService.add(file);
        fileService.init().then(function () {
            expect(fileService.getAll()).toContain(file);
        });
        $rootScope.$digest();
        done();
    });

    it('should allow files editing', function () {
        var file = {};
        file.name = 'New filename';
        file.code = 'New code';
        var file1 = fileService.get(1);
        expect(file1.name).not.toBe(file.name);
        expect(file1.code).not.toBe(file.code);
        fileService.edit(file, 1);
        file1 = fileService.get(1);
        expect(file1.name).toBe(file.name);
        expect(file1.code).toBe(file.code);
    });

    it('should allow deletion of files', function () {
        var file = fileService.get(fileService.getAll().length - 1);
        fileService.remove(file);
        expect(fileService.getAll()).not.toContain(file);
    });
});

describe('FileController', function () {
    beforeEach(module('pigeon.fileController'));
    beforeEach(module('pigeon.fileService'));

    beforeEach(inject(function (_$rootScope_, _fileService_) {
        $rootScope = _$rootScope_;
        fileService = _fileService_;
    }));

    beforeEach(function (done) {
        fileService.init();
        $rootScope.$digest();
        done();
    });

    describe('on adding file', function () {
        beforeEach(inject(function (_$controller_) {
            this.controller = _$controller_('FileController', {$scope: {}, $routeParams: {}, fileService: fileService});
        }));

        it('should has empty model', function () {
            expect(this.controller.file).toBeDefined();
            expect(this.controller.file.name).toBeUndefined();
            expect(this.controller.file.code).toBeUndefined();
        });

        it('should save model', function () {
            this.controller.file.name = 'Add file';
            this.controller.file.code = 'Add code';

            var files = fileService.getAll();
            expect(files).not.toContain(this.controller.file);
            this.controller.save();
            expect(files).toContain(this.controller.file);
            fileService.remove(files[files.length - 1]);
        });
    });

    describe('on edition file', function () {
        beforeEach(inject(function (_$controller_) {
            this.fileIndex = 1;
            this.controller = _$controller_('FileController',
                {$scope: {}, $routeParams: {fileIndex: this.fileIndex}, fileService: fileService});
        }));

        it('should load model', function () {
            var files = fileService.getAll();

            expect(this.controller.file).toBeDefined();
            expect(this.controller.file.name).toBe(files[this.fileIndex].name);
            expect(this.controller.file.code).toBe(files[this.fileIndex].code);
        });

        it('should save model', function () {
            this.controller.file.name = 'Edit file';
            this.controller.file.code = 'var a = 123;';

            var files = fileService.getAll();
            var file = fileService.get(this.fileIndex);
            expect(file.name).not.toBe(this.controller.file.name);
            expect(file.code).not.toBe(this.controller.file.code);
            this.controller.save();
            file = fileService.get(this.fileIndex);
            expect(file.name).toBe(this.controller.file.name);
            expect(file.code).toBe(this.controller.file.code);
        });
    });
});
