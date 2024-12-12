package ru.shabashoff.m5.exception

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.WebDataBinder
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.InitBinder
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler
import ru.shabashoff.m5.dto.response.ExceptionResponse

@ControllerAdvice
class BusinessExceptionHandler : ResponseEntityExceptionHandler() {

    @InitBinder
    fun initBinder(binder: WebDataBinder) {
        binder.initDirectFieldAccess()
    }

    @ExceptionHandler(BusinessException::class)
    fun handlerBusinessException(businessException: BusinessException): ResponseEntity<ExceptionResponse> =
        ResponseEntity.status(businessException.code)
            .body(ExceptionResponse(businessException.code, businessException.text))
}
